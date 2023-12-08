from rest_framework import serializers
from .models import Cart, Order, Product, User, Payment, CartItem, OrderItem

class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.ReadOnlyField(source='product.product_id')
    product_name = serializers.ReadOnlyField(source='product.product_name')
    product_price = serializers.ReadOnlyField(source='product.price')

    class Meta:
        model = CartItem
        fields = ['cart_item_id', 'product_id', 'product_name', 'product_price', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True, source='cartitem_set')

    class Meta:
        model = Cart
        fields = ['cart_id','created_at', 'items']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['product_id', 'product_name', 'description', 'price', 'image_url'] 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


