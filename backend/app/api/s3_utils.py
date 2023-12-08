import boto3

def get_image_urls(bucket_name):
    s3 = boto3.client('s3')
    paginator = s3.get_paginator('list_objects')
    operation_parameters = {'Bucket': bucket_name}
    page_iterator = paginator.paginate(**operation_parameters)

    image_urls = []
    for page in page_iterator:
        if 'Contents' in page:
            for item in page['Contents']:
                image_urls.append(f"https://{bucket_name}.s3.us-east-2.amazonaws.com/{item['Key']}")

    return image_urls
