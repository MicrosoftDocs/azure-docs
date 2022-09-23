---
title: "How to set up multi-cluster Layer 4 load balancing across Azure Kubernetes Fleet Manager member clusters (preview)"
description: Learn how to use Azure Kubernetes Fleet Manager to set up multi-cluster Layer 4 load balancing across workloads deployed on multiple member clusters.
ms.topic: how-to
ms.date: 09/09/2022
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
---

# Set up multi-cluster layer 4 load balancing across Azure Kubernetes Fleet Manager member clusters (preview)

Once an application has been deployed across multiple clusters using the [Kubernetes configuration propagation](./configuration-propagation.md) capability of Azure Kubernetes Fleet Manager (Fleet), admins often have a need to set up load balancing for incoming traffic across the service responsible for exposing the application in each of the Fleet resource's member clusters.

In this how-to guide, you'll set up layer 4 load balancing across workloads deployed across a fleet's member clusters.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

[!INCLUDE [free trial note](../../includes/quickstarts-free-trial-note.md)]

* You must have a Fleet resource with member clusters to which a workload has been deployed. This can be done by following [Quickstart: Create a Fleet resource and join member clusters](quickstart-create-fleet-and-members.md) and [Propagate Kubernetes configurations from a Fleet resource to member clusters](configuration-propagation.md)

* The target AKS clusters on which the workloads are deployed need to be using [Azure CNI networking](../aks/configure-azure-cni.md).

* The target AKS clusters on which the workloads are deployed need to be present on either the same [virtual network](../virtual-network/virtual-networks-overview.md) or on [peered virtual networks](../virtual-network/virtual-network-peering-overview.md).

* The target AKS clusters on which these workloads are deployed need to be [added as member clusters to the Fleet resource](./quickstart-create-fleet-and-members.md#join-member-clusters).

[!INCLUDE [preview features note](../../includes/azure-cli-prepare-your-environment-no-header.md)]

## Deploy a sample workload to demo clusters

> [!NOTE]
>
> * The steps in this how-to guide refer to a sample application, called `app`, for demonstration purposes only. You can substitute this workload for any of your own existing Deployment and Service objects.
>
> * These steps deploy the sample workload from the Fleet cluster to member clusters using Kubernetes configuration propagation. Alternatively, you can choose to deploy these Kubernetes configurations to each member cluster separately, one at a time.

1. Obtain `kubeconfig` for the fleet cluster

	```bash
	export GROUP=<your_resource_group_name>
	export FLEET=<your_fleet_name>
	az fleet get-credentials -n $FLEET -g $GROUP
	```

1. Create the deployment and service objects in a file called `demo-app.yaml`:

	```yml
	apiVersion: apps/v1
	kind: Deployment
	metadata:
		name: app
		namespace: demo
	spec:
		replicas: 2
		selector:
			matchLabels:
				app: hello-world
		template:
			metadata:
				labels:
					app: hello-world
			spec:
				containers:
					- name: python
						image: fleetnetbugbash.azurecr.io/app
						imagePullPolicy: Always
						ports:
						- containerPort: 8080
						env:
						- name: MEMBER_CLUSTER_ID
							valueFrom:
								configMapKeyRef:
									name: member-cluster-id
									key: id
						resources:
							requests:
								cpu: "0.2"
								memory: "400M"
							limits:
								cpu: "0.2"
								memory: "400M"
						volumeMounts:
							- mountPath: /etc/podinfo
								name: podinfo
				volumes:
					- name: podinfo
						downwardAPI:
							items:
								- path: "name"
									fieldRef:
										fieldPath: metadata.name
								- path: "namespace"
									fieldRef:
										fieldPath: metadata.namespace
    
    ---
    
    apiVersion: v1
    kind: Service
    metadata:
    	name: app
    	namespace: demo
    spec:
    	type: LoadBalancer
    	selector:
    		app: hello-world
    	ports:
    	- port: 80
    		targetPort: 8080
    	
    ---
    
    apiVersion: networking.fleet.azure.com/v1alpha1
    kind: ServiceExport
    metadata:
    	name: app
    	namespace: demo
	```

	The `ServiceExport` specification above allows you to export a service from one member cluster to the Fleet resource. Once successfully exported, Fleet will sync this service and all endpoints behind it to the hub, which other member clusters and Fleet resource-scoped load balancers can then consume.

1. Apply the deployment and service objects to the cluster:
	
	```bash
	kubectl apply -f ./artifacts/demo-app.yaml
	```


1. Verify that the service is successfully exported by running the following command:

	```bash
	kubectl get serviceexport app --namespace demo
	```

	You should see that the service is valid for export (`IS-VALID` field is `true`) and has no conflicts with other exports (`IS-CONFLICT` is `false`). 

	> [!NOTE]
	> It may take a minute or two for the ServiceExport to be propagated.

## Create MultiClusterService

1. Create a MultiClusterService object in a file called `mcs.yaml`:

	```yml
	apiVersion: networking.fleet.azure.com/v1alpha1
	kind: MultiClusterService
	metadata:
		name: app
		namespace: work
	spec:
		serviceImport:
			name: app
	```

	and apply it to the cluster:

	```yml
	kubectl apply -f ./artifacts/mcs.yaml --namespace demo
	```

1. Verify that the import is successful by running the following command:

	```bash
	kubectl get mcs app --namespace demo
	```

	The `IS-VALID` field should be `true` in the output. Check out the external load balancer IP address (`EXTERNAL-IP`) in the output. It may take a while before the import is fully processed and the IP address becomes available.

1. Open a browser window and visit the IP address. You should see a "Hello World!" message returned by the application. The message should also include the namespace and name of the endpoint (a pod), and the cluster where the pod comes from.

1. Refresh the page multiple times and you will see that pods from both member clusters are exposed by the MultiClusterService, showcasing how load balancing for incoming traffic is happening across all these pods.
