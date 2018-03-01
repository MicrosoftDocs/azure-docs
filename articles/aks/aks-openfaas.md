# Using OpenFaaS on AKS

[OpenFaaS](https://www.openfaas.com/) is a framework for building Serverless functions on top of containers. As an Open Source project it has gained large-scale adoption within the community.

## Prerequisites

In order to complete the steps within this article, you need the following.

* Basic understanding of Kubernetes.
* An Azure Container Service (AKS) cluster and AKS credentials configured on your development system.
* Azure CLI installed on your development system.
* Git command-line tools installed on your system.

## Get OpenFaaS

Clone the OpenFaaS project repository to your development system.

```azurecli-interactive
git clone https://github.com/openfaas/faas-netes
```

Change into the directory of the cloned repository.

```azurecli-interactive
cd faas-netes 
```

## Create OpenFaaS namespaces

As a good practice, OpenFaaS and OpenFaaS functions should be stored in their own Kubernetes namespace.

Create a namespace for the OpenFaaS system.

```azurecli-interactive
kubectl create namespace openfaas
```

Create a second namespace for OpenFaaS functions.

```azurecli-interactive 
kubectl create namespace openfaas-fn
```

## Deploy OpenFaaS

A Helm chart for OpenFaaS is included in the cloned repository. Use this to deploy OpenFaaS into your AKS cluster.

```azurecli-interactive
helm install --namespace openfaas -n openfaas --set functionNamespace=openfaas-fn,serviceType=LoadBalancer,rbac=false chart/openfaas/ 
```

Output:

```
NAME:   openfaas
LAST DEPLOYED: Wed Feb 28 08:26:11 2018
NAMESPACE: openfaas
STATUS: DEPLOYED

RESOURCES:
==> v1/ConfigMap
NAME                 DATA  AGE
prometheus-config    2     20s
alertmanager-config  1     20s

{snip}

NOTES:
To verify that openfaas has started, run:

  kubectl --namespace=openfaas get deployments -l "release=openfaas, app=openfaas"
```
## Get public IP address

When the service has been deployed, a public IP address is created for accessing the OpenFaaS gateway. To retrieve this IP address, use the kubectl get service command. It may take a minute for the IP address to be assigned to the service.

```console
kubectl get service -n openfaas
```

Output. 

```console
NAME                    TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)          AGE
alertmanager            ClusterIP      10.0.162.129   <none>           9093/TCP         3m
alertmanager-external   ClusterIP      10.0.67.255    <none>           9093/TCP         3m
faas-netesd             ClusterIP      10.0.164.82    <none>           8080/TCP         3m
faas-netesd-external    ClusterIP      10.0.10.120    <none>           8080/TCP         3m
gateway                 ClusterIP      10.0.16.93     <none>           8080/TCP         3m
gateway-external        LoadBalancer   10.0.1.89      52.191.114.246   8080:31143/TCP   3m
nats                    ClusterIP      10.0.99.173    <none>           4222/TCP         3m
nats-external           ClusterIP      10.0.45.42     <none>           4222/TCP         3m
prometheus              ClusterIP      10.0.153.0     <none>           9090/TCP         3m
prometheus-external     LoadBalancer   10.0.54.203    52.226.128.86    9090:31208/TCP   3m
```

## Test OpenFaas

Browse to the endpoint IP address on port 8080.

And create your first OpenFaas function - you can use the Figlet service from the OpenFaaS marketplace as a smoketest.

![alt text](media/container-service-serverless/invoke.png "Test OpenFaas")

And let's use curl for this endpoint

```console
$  curl -X POST http://52.191.114.246:8080/function/figlet -d "Hello Azure"
```
```console
 _   _      _ _            _                        
| | | | ___| | | ___      / \    _____   _ _ __ ___ 
| |_| |/ _ \ | |/ _ \    / _ \  |_  / | | | '__/ _ \
|  _  |  __/ | | (_) |  / ___ \  / /| |_| | | |  __/
|_| |_|\___|_|_|\___/  /_/   \_\/___|\__,_|_|  \___|

```



## Deploying your own function to OpenFaaS
OpenFaaS has its own CLI that allows you to create a function in languages of your choice, or deploy a Docker container.

As an example, you can use a CosmosDB instance, and provide that data through a lightweight function for public consumption.

### Install the FaaS CLI

Install the [FaaS CLI](https://github.com/openfaas/faas-cli) so that you can deploy your functions quickly, or deploy via brew for the Mac.

```console
brew install faas-cli
```

### Deploy Cosmos DB
Create a new resource group for backing services.

```console
$  az group create -n serverless-backing -l eastus
```
```console
Location    Name
----------  ----------------
eastus      serverless-backing
```

And deploy a CosmosDB instance of type "Mongo" to store 

```console
$  az cosmosdb create -n openfaas-cosmos -g serverless-backing --kind MongoDB
```
```console
DatabaseAccountOfferType    DocumentEndpoint                                  Kind     Location    Name             ProvisioningState    ResourceGroup
--------------------------  ------------------------------------------------  -------  ----------  ---------------  -------------------  ------------------
Standard                    https://openfaas-cosmos.documents.azure.com:443/  MongoDB  East US     openfaas-cosmos  Succeeded            serverless-backing
```

### Get CosmosDB Connection String

```console
$  az cosmosdb list-connection-strings -g serverless-backing -n openfaas-cosmos -o json
```

```json
{
  "connectionStrings": [
    {
      "connectionString": "mongodb://openfaas-cosmos:OTIVxYGZok-{snip}-byu2ee4vCA==@openfaas-cosmos.documents.azure.com:10255/?ssl=true",
      "description": "Default MongoDB Connection String"
    }
  ]
}
```

## Load sample data into a collection in CosmosDB

Use the *mongoimport* tool to load the CosmosDB instance with data that the Function will present back to the calling user.  

The data to load should be saved into a file called plans.json


```json
{
	"name" : "two_person",
	"friendlyName" : "Two Person Plan",
	"portionSize" : "1-2 Person",
	"mealsPerWeek" : "3 Unique meals per week",
	"price" : 72,
	"description" : "Our basic plan, delivering 3 meals per week, which will feed 1-2 people.",
	"__v" : 0
}
```

Notice that the connection string has been altered to reference the **plans** database.

```console
$  mongoimport --uri="mongodb://openfaas-cosmos:OTIVxYGZok-{snip}-byu2ee4vCA==@openfaas-cosmos.documents.azure.com:10255/plans?ssl=true"  -c plans < plans.json 
2018-02-19T14:42:14.313+0000    connected to: localhost
2018-02-19T14:42:14.918+0000    imported 1 document
```


##  Deploying your function in OpenFaaS

To deploy the pre-built Golang container, you need values for the following variables:

* OpenFaaS Gateway IP: The URL for your deployed OpenFaaS Gateway with AKS, it is the same as your OpenFaaS UI URL without the ui suffix, in the case of this example: ```http://52.191.114.246:8080```

* image: You can use the pre-built container which has been pushed to Docker Hub
 ```console
 shanepeckham/openfaascosmos
 ```

* Name: This is the name of your function, it can be anything

* env: The environment variable to pass the CosmosDB connection string at runtime.  You should not store the connection details within code, ideally you would use a Kubernetes secret or inject this via Azure Key Vault. This will have the format 
```console
--env=NODE_ENV="mongodb://openfaas-cosmos:OTIVxYGZok-{snip}-byu2ee4vCA==@openfaas-cosmos.documents.azure.com:10255/?ssl=true"
```

You can now use the faas-cli to deploy the pre-built container to the OpenFaaS Gateway. To do so you need to run the following command:

```console
$  faas-cli deploy -g http://52.226.73.206:8080 --image=shanepeckham/openfaascosmos --name=cosmos-query --env=NODE_ENV="mongodb://openfaas-cosmos:OTIVxYGZok-{snip}-byu2ee4vCA==@openfaas-cosmos.documents.azure.com:10255/?ssl=true"
```
Select enter to deploy your function and you should see your newly created OpenFaaS endpoint for your function:

```console
Deployed. 202 Accepted.
URL: http://52.191.114.246:8080/function/cosmos-query
```

Now you can test your function using curl:

```console
$  curl -s http://52.191.114.246:8080/function/cosmos-query  | jq
```
```json
[
  {
    "ID": "",
    "Name": "two_person",
    "FriendlyName": "",
    "PortionSize": "",
    "MealsPerWeek": "",
    "Price": 72,
    "Description": "Our basic plan, delivering 3 meals per week, which will feed 1-2 people."
  }
]
```

You can also test the function within the OpenFaaS UI:

![alt text](media/container-service-serverless/OpenFaaSUI.png)

# Next Steps
The default deployment of OpenFaas needs to be locked down for both OpenFaaS Gateway and Functions. [Alex Ellis' Blog post](https://blog.alexellis.io/lock-down-openfaas/) has more details on the options to do this. 
