# Using OpenFaaS on AKS

[OpenFaaS]:[open-faas] is a framework for building Serverless functions on top of containers. As an Open Source project, it has gained large-scale adoption within the community. This document details installing and using OpenFaas on an Azure Container Service (AKS) cluster.

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

## Deploy OpenFaaS

As a good practice, OpenFaaS and OpenFaaS functions should be stored in their own Kubernetes namespace.

Create a namespace for the OpenFaaS system.

```azurecli-interactive
kubectl create namespace openfaas
```

Create a second namespace for OpenFaaS functions.

```azurecli-interactive 
kubectl create namespace openfaas-fn
```

A Helm chart for OpenFaaS is included in the cloned repository. Use this chart to deploy OpenFaaS into your AKS cluster.

```azurecli-interactive
helm install --namespace openfaas -n openfaas \
  --set functionNamespace=openfaas-fn, \
  --set serviceType=LoadBalancer, \
  --set rbac=false chart/openfaas/ 
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
## Test OpenFaaS

When the service has been deployed, a public IP address is created for accessing the OpenFaaS gateway. To retrieve this IP address, use the [kubectl get service]:[kubectl-get] command. It may take a minute for the IP address to be assigned to the service.

```console
kubectl get service -l component=gateway --namespace openfaas
```

Output. 

```console
NAME               TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)          AGE
gateway            ClusterIP      10.0.156.194   <none>         8080/TCP         7m
gateway-external   LoadBalancer   10.0.28.18     52.186.64.52   8080:30800/TCP   7m
```

Browse to the external gateway IP address on port 8080, `http://52.186.64.52:8080` in this example.

![OpenFaaS UI](media/container-service-serverless/openfaas.png)

## Create function portal

Click on the **hamburger menu** > **Deploy New Function** > and search for **Figlet**.

Select the Figlet function, and click **Deploy**.

![Figlet](media/container-service-serverless/figlet.png)

Finally, use curl to invoke the function. Replace the IP address in the following example with that of your OpenFaas gateway.

```azurecli-interactive
curl -X POST http://52.186.64.52:8080/function/figlet -d "Hello Azure"
```

Output:

```console
 _   _      _ _            _                        
| | | | ___| | | ___      / \    _____   _ _ __ ___ 
| |_| |/ _ \ | |/ _ \    / _ \  |_  / | | | '__/ _ \
|  _  |  __/ | | (_) |  / ___ \  / /| |_| | | |  __/
|_| |_|\___|_|_|\___/  /_/   \_\/___|\__,_|_|  \___|

```

## Prepare for second function

Create a new resource group for backing services.

```azurecli-interactive
az group create --name serverless-backing --location eastus
```

Deploy a CosmosDB instance of type "Mongo". The instance needs a unique name, update `openfaas-cosmose` to something unique to your environment. 

```azurecli-interactive
az cosmosdb create --resource-group serverless-backing --name openfaas-cosmos007 --kind MongoDB
```

Get the Cosmos database connection string and store it in a variable.

```azurecli-interactive
COSMOS=$(az cosmosdb list-connection-strings --resource-group serverless-backing --name openfaas-cosmos007 --query connectionStrings[0].connectionString --output tsv)
```

Use the *mongoimport* tool to load the CosmosDB instance with data.

Create a file named `plans.json` and copy in the following json.

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

```azurecli-interactive
brew install mongodb
```

```azurecli-interactive
mongoimport --uri=$COSMOS -c plans < plans.json
```

Output:

```console
2018-02-19T14:42:14.313+0000    connected to: localhost
2018-02-19T14:42:14.918+0000    imported 1 document
```

## Create second function

OpenFaaS has a CLI that allows you to create functions in a language of your choice. You can also deploy Docker containers.

As an example, you can use a CosmosDB instance, and provide that data through a lightweight function for public consumption.

Install the [FaaS CLI](https://github.com/openfaas/faas-cli) so that you can deploy your functions quickly, or deploy via brew for the Mac.

```console
brew install faas-cli
```

Run the following command to deploy the pre-built container.

```azurecli-interctive
faas-cli deploy -g http://52.186.64.52:8080 --image=shanepeckham/openfaascosmos --name=cosmos-query --env=NODE_ENV=$COSMOS
```

Once deployed, you should see your newly created OpenFaaS endpoint for the function.


```console
Deployed. 202 Accepted.
URL: http://52.186.64.52:8080/function/cosmos-query
```

Now you can test the function using curl.

```console
$  curl -s http://52.186.64.52:8080/function/cosmos-query  | jq
```

Output:

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

<!-- LINKS - external -->
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[open-faas]: https://www.openfaas.com/