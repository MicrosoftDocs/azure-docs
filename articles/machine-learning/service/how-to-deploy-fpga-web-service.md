---
title: How to deploy a model as a web service on an FPGA with Azure Machine Learning 
description: Learn how to deploy a web service with a model running on an FPGA with Azure Machine Learning. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: jmartens
ms.author: tedway
author: tedway
ms.date: 09/24/2018
---

# Deploy a model as a web service on an FPGA with Azure Machine Learning

You can deploy a model as a web service on [field programmable gate arrays (FPGAs)](concept-accelerate-with-fpgas.md).  Using FPGAs provides ultra-low latency inferencing, even with a single batch size.   

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- An Azure Machine Learning workspace and the Azure Machine Learning SDK for Python installed. Learn how to get these prerequisites using the [How to configure a development environment](how-to-configure-environment.md) document.
 
  - Your workspace needs to be in the *East US 2* region.

  - Install the contrib extras:

    ```shell
    pip install --upgrade azureml-sdk[contrib]
    ```  

## Create and deploy your model
Create a pipeline to preprocess the input image, featurize it using ResNet 50 on an FPGA, and then run the features through a classifer trained on the ImageNet data set.

For your convenience the entire flow is available in a Jupyter notebook.  Sample code is provided here.

[**Launch samples in Azure Notebooks**](https://aka.ms/aml-notebooks) and navigate to `tutorials/80.realtimai-quickstart.ipynb`.  From Azure Notebooks, you can also download the notebook to use on your own Jupyter server.
 
Follow the instructions in the notebook to:

* Define the model pipeline
* Deploy the model
* Consume the deployed model
* Delete deployed services

> [!IMPORTANT]
> To optimize latency and throughput, your client should be in the same Azure region as the endpoint.  Currently the APIs are created in the East US Azure region.

### Preprocess image
The first stage of the pipeline is to preprocess the images.

```python
import os
import tensorflow as tf

# Input images as a two-dimensional tensor containing an arbitrary number of images represented a strings
import azureml.contrib.brainwave.models.utils as utils
in_images = tf.placeholder(tf.string)
image_tensors = utils.preprocess_array(in_images)
print(image_tensors.shape)
```
### Add Featurizer
Initialize the model and download a TensorFlow checkpoint of the quantized version of ResNet50 to be used as a featurizer.

```python
from azureml.contrib.brainwave.models import QuantizedResnet50, Resnet50
model_path = os.path.expanduser('~/models')
model = QuantizedResnet50(model_path, is_frozen = True)
feature_tensor = model.import_graph_def(image_tensors)
print(model.version)
print(feature_tensor.name)
print(feature_tensor.shape)
```

### Add Classifier
This classifier has been trained on the ImageNet data set.

```python
classifier_input, classifier_output = Resnet50.get_default_classifier(feature_tensor, model_path)
```

### Create service definition
Now that you have definied the image preprocessing, featurizer, and classifier that executes on the service, you can create a service definition. The service definition is a set of files generated from the model that is deployed to the FPGA service. The service definition consists of a pipeline. The pipeline is a series of stages that are executed in order.  TensorFlow stages, Keras stages, and BrainWave stages are supported.  The stages are executed in order on the service, with the output of each stage input into the subsequent stage.

To create a TensorFlow stage, specify a session containing the graph (in this case default graph is used) and the input and output tensors to this stage.  This information is used to save the graph so that it can be executed on the service.

```python
from azureml.contrib.brainwave.pipeline import ModelDefinition, TensorflowStage, BrainWaveStage

save_path = os.path.expanduser('~/models/save')
model_def_path = os.path.join(save_path, 'service_def.zip')

model_def = ModelDefinition()
with tf.Session() as sess:
    model_def.pipeline.append(TensorflowStage(sess, in_images, image_tensors))
    model_def.pipeline.append(BrainWaveStage(sess, model))
    model_def.pipeline.append(TensorflowStage(sess, classifier_input, classifier_output))
    model_def.save(model_def_path)
    print(model_def_path)
```

### Deploy model
Create a service from the service definition.  Your workspace needs to be in the East US 2 location.

```python
from azureml.core import Workspace

ws = Workspace.from_config()
print(ws.name, ws.resource_group, ws.location, ws.subscription_id, sep = '\n')
print(ws._auth.get_authentication_header())

from azureml.core.model import Model
model_name = "resnet-50-rtai"
registered_model = Model.register(ws, model_def_path, model_name)

from azureml.core.webservice import Webservice
from azureml.exceptions import WebserviceException
from azureml.contrib.brainwave import BrainwaveWebservice, BrainwaveImage
service_name = "imagenet-infer"
service = None
try:
    service = Webservice(ws, service_name)
except WebserviceException:
    image_config = BrainwaveImage.image_configuration()
    deployment_config = BrainwaveWebservice.deploy_configuration()
    service = Webservice.deploy_from_model(ws, service_name, [registered_model], image_config, deployment_config)
    service.wait_for_deployment(true)
```

### Test the service
To send an image to the API and test the response, add a mapping from the output class ID to the ImageNet class name.

```python
import requests
classes_entries = requests.get("https://raw.githubusercontent.com/Lasagne/Recipes/master/examples/resnet50/imagenet_classes.txt").text.splitlines()
```

Call your service and replace the "your-image.jpg" file name below with an image from your machine. 

```python
with open('your-image.jpg') as f:
    results = service.run(f)
# map results [class_id] => [confidence]
results = enumerate(results)
# sort results by confidence
sorted_results = sorted(results, key=lambda x: x[1], reverse=True)
# print top 5 results
for top in sorted_results[:5]:
    print(classes_entries[top[0]], 'confidence:', top[1])
``` 

### Clean up service
Delete the service.

```python
service.delete()
    
registered_model.delete()
```

## Secure your deployment with SSL/TLS and authentication

Azure Machine Learning Hardware Accelerated Models provides SSL support and key-based authentication. This enables you to restrict access to your service and secure data submitted by clients.

> [!NOTE]
> The steps in this section only apply to Azure Machine Learning Hardware Accelerated Models.

> [!IMPORTANT]
> Authentication is only enabled for services that have provided an SSL certificate and key. 
>
> If you do not enable SSL, any user on the internet will be able to make calls to the service.
>
> If you enable SSL, and authentication key is required when accessing the service.

SSL encrypts data sent between the client and the service. It also used by the client to verify the identity of the server.

You can deploy a service with SSL enabled, or update an already deployed service to enable it. The steps are the same:

1. Acquire a domain name.

2. Acquire an SSL certificate.

3. Deploy or update the service with SSL enabled.

4. Update your DNS to point to the service.

### Acquire a domain name

If you do not already own a domain name, you can purchase one from a __domain name registrar__. The process differs between registrars, as does the cost. The registrar also provides you with tools for managing the domain name. These tools are used to map a fully qualified domain name (such as www.contoso.com) to the IP address that your service is hosted at.

### Acquire an SSL certificate

There are many ways to get an SSL certificate. The most common is to purchase one from a __Certificate Authority__ (CA). Regardless of where you obtain the certificate, you need the following files:

* A __certificate__. The certificate must contain the full certificate chain, and must be PEM-encoded.
* A __key__. The key must be PEM-encoded.

> [!TIP]
> If the Certificate Authority cannot provide the certificate and key as PEM-encoded files, you can use a utility such as [OpenSSL](https://www.openssl.org/) to change the format.

> [!IMPORTANT]
> Self-signed certificates should be used only for development. They should not be used in production.
>
> If you use a self-signed certificate, see the [Consuming services with self-signed certificates](#self-signed) section for specific instructions.

> [!WARNING]
> When requesting a certificate, you must provide the fully qualified domain name (FQDN) of the address you plan to use for the service. For example, www.contoso.com. The address stamped into the certificate and the address used by the clients are compared when validating the identity of the service.
>
> If the addresses do not match, the clients will receive an error. 

### Deploy or update the service with SSL enabled

To deploy the service with SSL enabled, set the `ssl_enabled` parameter to `True`. Set the `ssl_certificate` parameter to the value of the __certificate__ file and the `ssl_key` to the value of the __key__ file. The following example demonstrates deploying a service with SSL enabled:

```python
from amlrealtimeai import DeploymentClient

subscription_id = "<Your Azure Subscription ID>"
resource_group = "<Your Azure Resource Group Name>"
model_management_account = "<Your AzureML Model Management Account Name>"
location = "eastus2"

model_name = "resnet50-model"
service_name = "quickstart-service"

deployment_client = DeploymentClient(subscription_id, resource_group, model_management_account, location)

with open('cert.pem','r') as cert_file:
    with open('key.pem','r') as key_file:
        cert = cert_file.read()
        key = key_file.read()
        service = deployment_client.create_service(service_name, model_id, ssl_enabled=True, ssl_certificate=cert, ssl_key=key)
```

The response of the `create_service` operation contains the IP address of the service. The IP address is used when mapping the DNS name to the IP address of the service.

The response also contains a __primary key__ and __secondary key__ that are used to consume the service.

### Update your DNS to point to the service

Use the tools provided by your domain name registrar to update the DNS record for your domain name. The record must point to the IP address of the service.

> [!NOTE]
> Depending on the registrar, and the time to live (TTL) configured for the domain name, it can take several minutes to several hours before clients can resolve the domain name.

### Consume authenticated services

The following examples demonstrate how to consume an authenticated service using Python and C#:

> [!NOTE]
> Replace `authkey` with the primary or secondary key returned when creating the service.

```python
from amlrealtimeai import PredictionClient
client = PredictionClient(service.ipAddress, service.port, use_ssl=True, access_token="authKey")
image_file = R'C:\path_to_file\image.jpg'
results = client.score_image(image_file)
```

```csharp
var client = new ScoringClient(host, 50051, useSSL, "authKey");
float[,] result;
using (var content = File.OpenRead(image))
    {
        IScoringRequest request = new ImageRequest(content);
        result = client.Score<float[,]>(request);
    }
```

Other gRPC clients can authenticate requests by setting an authorization header. The general approach is to create a `ChannelCredentials` object that combines `SslCredentials` with `CallCredentials`. This is added to the authorization header of the request. For more information on implementing support for your specific headers, see [https://grpc.io/docs/guides/auth.html](https://grpc.io/docs/guides/auth.html).

The following examples demonstrate how to set the header in C# and Go:

```csharp
creds = ChannelCredentials.Create(baseCreds, CallCredentials.FromInterceptor(
                      async (context, metadata) =>
                      {
                          metadata.Add(new Metadata.Entry("authorization", "authKey"));
                          await Task.CompletedTask;
                      }));

```

```go
conn, err := grpc.Dial(serverAddr, 
    grpc.WithTransportCredentials(credentials.NewClientTLSFromCert(nil, "")),
    grpc.WithPerRPCCredentials(&authCreds{
    Key: "authKey"}))

type authCreds struct {
    Key string
}

func (c *authCreds) GetRequestMetadata(context.Context, uri ...string) (map[string]string, error) {
    return map[string]string{
        "authorization": c.Key,
    }, nil
}

func (c *authCreds) RequireTransportSecurity() bool {
    return true
}
```

### <a id="self-signed"></a>Consuming services with self-signed certificates

There are two ways to enable the client to authenticate to a server secured with a self-signed certificate:

* On the client system, set the `GRPC_DEFAULT_SSL_ROOTS_FILE_PATH` environment variable on the client system to point to the certificate file.

* When constructing an `SslCredentials` object, pass the contents of the certificate file to the constructor.

Using either method causes gRPC to use the certificate as the root cert.

> [!IMPORTANT]
> gRPC does not accept untrusted certificates. Using an untrusted certificate will fail with an `Unavailable` status code. The details of the failure contain `Connection Failed`.
