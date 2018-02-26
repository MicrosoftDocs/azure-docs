# Using OpenFaaS on AKS
[OpenFaaS](https://www.openfaas.com/) is a framework for building Serverless functions on top of containers.  As an Open Source project it has gained large-scale adoption within the community.

## Prerequisites
In order to complete the steps within this article, you will need the following.

* Basic understanding of Kubernetes.
* An Azure Container Service (AKS) cluster and AKS credentials configured on your development system.
* Azure CLI installed on your development system.
* Git command-line tools installed on your system.

## Install OpenFaaS

```
➜  git clone https://github.com/openfaas/faas-netes
Cloning into 'faas-netes'...
remote: Counting objects: 2065, done.
remote: Compressing objects: 100% (14/14), done.
remote: Total 2065 (delta 9), reused 9 (delta 4), pack-reused 2047
Receiving objects: 100% (2065/2065), 2.16 MiB | 2.04 MiB/s, done.
Resolving deltas: 100% (910/910), done.
➜  cd faas-netes 
```

## Create OpenFaaS namespaces

```
➜  faas-netes git:(master) kubectl apply -f namespaces.yml 
namespace "openfaas" created
namespace "openfaas-fn" created
```

## Install OpenFaaS

```
➜  faas-netes git:(master) kubectl apply -f yaml
service "alertmanager" created
deployment "alertmanager" created
configmap "alertmanager-config" created
service "faas-netesd" created
deployment "faas-netesd" created
deployment "gateway" created
service "gateway" created
service "nats" created
deployment "nats" created
service "prometheus" created
deployment "prometheus" created
configmap "prometheus-config" created
deployment "queue-worker" created
serviceaccount "faas-controller" created
role "faas-controller" created
rolebinding "faas-controller-fn" created
```

## Remove NodePort configuration for gateway

By default, the OpenFaaS gateway uses a NodePort service definition.  Delete the gateway service so that it can be exposed using the Azure LoadBalancer.

```
➜  faas-netes git:(master) kubectl delete service gateway --namespace openfaas
```


## Deploy the gateway as a LoadBalancer service 

```
➜  faas-netes git:(master) kubectl apply -f cloud/lb.yml
service "gateway" created
```

### Get Gateway Endpoint IP address
Once the service has been deployed, you will see the Gateway public IP address within the Kubernetes published services.

```
➜  kubectl get svc -n openfaas
NAME           TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)          AGE
alertmanager   ClusterIP      10.0.121.41    <none>          9093/TCP         27m
faas-netesd    ClusterIP      10.0.207.218   <none>          8080/TCP         27m
gateway        LoadBalancer   10.0.199.149   52.226.73.206   8080:31112/TCP   8m
nats           ClusterIP      10.0.243.133   <none>          4222/TCP         27m
prometheus     NodePort       10.0.129.47    <none>          9090:31119/TCP   27m
```

## Test OpenFaas
Goto the endpoint IP address with your browser, port 8080.  And create your first OpenFaas function - you can use the Figlet service from the OpenFaaS marketplace.

![alt text](media/container-service-serverless/invoke.gif "Test OpenFaas")

And let's use curl for this endpoint

```
➜  ServerlessOnAKS git:(master) ✗ curl -X POST http://52.226.73.206:8080/function/figlet -d "Hello Azure"
 _   _      _ _            _                        
| | | | ___| | | ___      / \    _____   _ _ __ ___ 
| |_| |/ _ \ | |/ _ \    / _ \  |_  / | | | '__/ _ \
|  _  |  __/ | | (_) |  / ___ \  / /| |_| | | |  __/
|_| |_|\___|_|_|\___/  /_/   \_\/___|\__,_|_|  \___|

```



## Deploying a function to OpenFaas 

### Install the FaaS CLI

Install the [FaaS CLI](https://github.com/openfaas/faas-cli) so that you can deploy your functions quickly.

### Deploy Cosmos DB
Create a new resource group for backing services outside of the AKS cluster group.

```
➜  az group create -n serverless-backing -l eastus
Location    Name
----------  ----------------
eastus      serverless-backing
```

And deploy a CosmosDB instance of type "Mongo."

```
➜  ~ az cosmosdb create -n openfaas-cosmos -g serverless-backing --kind MongoDB
DatabaseAccountOfferType    DocumentEndpoint                                  Kind     Location    Name             ProvisioningState    ResourceGroup
--------------------------  ------------------------------------------------  -------  ----------  ---------------  -------------------  ------------------
Standard                    https://openfaas-cosmos.documents.azure.com:443/  MongoDB  East US     openfaas-cosmos  Succeeded            serverless-backing
```

### Get CosmosDB Connection String

```
➜  az cosmosdb list-connection-strings -g serverless-backing -n openfaas-cosmos -o json                                                 

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


```
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

```
➜  mongoimport --uri="mongodb://openfaas-cosmos:OTIVxYGZok-{snip}-byu2ee4vCA==@openfaas-cosmos.documents.azure.com:10255/plans?ssl=true"  -c plans < plans.json 
2018-02-19T14:42:14.313+0000    connected to: localhost
2018-02-19T14:42:14.918+0000    imported 1 document
```


##  Deploying a function in OpenFaaS

In order to deploy the pre-built Golang container, you need values for the following variables:

* OpenFaaS Gateway IP: This is the URL for your deployed OpenFaaS Gateway with AKS, it is the same as your OpenFaaS UI URL without the ui suffix, in the case of this example: ```http://52.226.73.206:8080```

* image: For this example you can use the pre-built container which has been pushed to Docker Hub
 ```shanepeckham/openfaascosmos```

* Name: This is the name of your function, it can be anything

* env: This is an environment variable which will be used to pass our CosmosDB connection string at runtime, you should not store the connection details within code, ideally you would use a Kubernetes secret or inject this via Azure Key Vault. This will have the format ```--env=NODE_ENV="mongodb://openfaas-cosmos:OTIVxYGZok-{snip}-byu2ee4vCA==@openfaas-cosmos.documents.azure.com:10255/?ssl=true"```

You can now use the faas-cli to deploy the pre-built container to the OpenFaaS Gateway. To do so you need to run the following command:

```
➜  faas-cli deploy -g http://52.226.73.206:8080 --image=shanepeckham/openfaascosmos --name=cosmos-query --env=NODE_ENV="mongodb://openfaas-cosmos:OTIVxYGZok-{snip}-byu2ee4vCA==@openfaas-cosmos.documents.azure.com:10255/?ssl=true"
```
Select enter to deploy your function and you should see your newly created OpenFaaS endpoint for your function:

```
Deployed. 202 Accepted.
URL: http://52.226.73.206:8080/function/cosmos-query
```

Now you can test your function using curl:

```
➜  curl -s http://52.226.73.206:8080/function/cosmos-query  | jq
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

You can also test our function within the OpenFaaS UI, see below:

![alt text](media/container-service-serverless/OpenFaaSUI.png)

You have now successfully deployed a function to OpenFaaS and queried your plans Database and Collection in Azure CosmosDB!
