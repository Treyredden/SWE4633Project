from django.shortcuts import render
from django.db.models import Sum, F
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from .models import *
from .serializers import *  

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        product = self.get_object()
        reviews = product.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    @action(detail=True, methods=['get'])
    def items(self, request, pk=None):
        cart = self.get_object()
        print('Cart:', cart)
        items = cart.cartitem_set.all()
        print('Items:', items)
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def total(self, request, pk=None):
        cart = self.get_object()
        total = CartItem.objects.filter(cart=cart).aggregate(
            total=Sum(F('quantity') * F('product__price'), output_field=models.DecimalField())
        )['total']

        return Response({'total': str(total) if total else '0'})

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product')
        cart_id = request.data.get('cart')
        quantity = int(request.data.get('quantity', 1))

        if quantity <= 0:
            raise ValidationError('Quantity must be a positive integer.')

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise ValidationError('Product does not exist.')

        cart = Cart.objects.get(id=cart_id)

        cart_item, created = CartItem.objects.get_or_create(
            product=product,
            cart=cart,
            defaults={'quantity': quantity},
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        cart_item = self.get_object()
        quantity = int(request.data.get('quantity', cart_item.quantity))

        if quantity <= 0:
            raise ValidationError('Quantity must be a positive integer.')

        cart_item.quantity = quantity
        cart_item.save()

        serializer = self.get_serializer(cart_item)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        cart_item = self.get_object()
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)