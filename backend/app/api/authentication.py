from rest_framework.authentication import BaseAuthentication
from jose import jwt, JWTError

class CognitoAuthentication(BaseAuthentication):
    
    def authenticate(self, request):
        auth = request.META.get('HTTP_AUTHORIZATION', None)
        if not auth:
            return None

        # Split the 'Bearer' token
        prefix, token = auth.split()
        try:
            # Decode and validate the token
            # Replace 'your_cognito_public_key' and 'your_cognito_audience' with actual values
            decoded = jwt.decode(token, 'your_cognito_public_key', audience='your_cognito_audience')
            # You might also validate other aspects of the token here
            return (decoded, None)  # You can return a user object here if necessary
        except JWTError:
            return None

