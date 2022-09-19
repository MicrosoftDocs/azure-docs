---
title: "Set up multi-cluster Layer 4 load balancing (preview)"
description: You can use to fleet to set up multi-cluster Layer 4 load balancing across workloads deployed on multiple clusters.
ms.topic: how-to
ms.date: 09/09/2022
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
---

# Set up multi-cluster Layer 4 load balancing (preview)

Once an application has been deployed across multiple clusters using the [Kubernetes configuration propagation](./configuration-propagation.md) capability of fleet, admins often have a necessity to set up load balancing for incoming traffic across the service exposing this application in each of the member clusters. This documents walks you through how you can set up Layer 4 load balancing across workloads deployed across fleet member clusters.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

* The target AKS clusters on which these workloads are deployed need to be using the [Azure CNI networking](../aks/configure-azure-cni).

* The target AKS clusters on which these workloads are deployed need to be present on either the same [virtual network](../virtual-network/virtual-networks-overview.md) or on [peered virtual networks](../virtual-network/virtual-network-peering-overview.md).

* The target AKS clusters on which these workloads are deployed need to be [added as member clusters to the fleet resource](./quickstart-create-fleet-and-members.md).


## Deploy sample workload to demo clusters

> [!NOTE]
> * This document deploys the sample workload shown in this section to member clusters for demonstration purposes only. You can instead substitute this for any of your own Deployment and Service objects.
> * This document deploys the sample application from fleet cluster to member clusters using the Kubernetes configuration propagation capability of fleet. Alternatively, you can instead choose to deploy these Kubernetes configurations to each member cluster separately one at a time if you want to.  

1. Obtain `kubeconfig` for the fleet cluster

	```bash
	export GROUP=<your_resource_group_name>
	export FLEET=<your_fleet_name>
	az fleet get-credentials -n $FLEET -g $GROUP
	```

1. Apply the following deployment and service objects:


	```
	kubectl apply -f ./artifacts/demo-app.yaml
	```
	
	Contents of `demo-app.yaml`:
	
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


	The `ServiceExport` specification above allows one to export a service from one member cluster to the fleet. Once successfully exported, fleet  will sync this service and all endpoints behind it to the hub, which other member clusters and fleet-scoped load balancer can then consume.

1. Verify that the service is successfully exported by running the following command:

	```
	kubectl get serviceexport app --namespace demo
	```

	You should see that the service is valid for export (`IS-VALID` field is `true`) and has no conflicts with other exports (`IS-CONFLICT` is `false`). 

	> [!NOTE]
	> It may take a minute or two for the ServiceExport to be propagated.

## Create MultiClusterService

1. Create a MultiClusterService object:

	```yml
	kubectl apply -f ./artifacts/mcs.yaml --namespace demo
	```

	Contents of `mcs.yaml`:
	
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


1. Verify that the import is successful by running the following command:


	```bash
	kubectl get mcs app --namespace demo
	```
	`IS-VALID` field should be `true` in the output. Check out the external load balancer IP address (EXTERNAL-IP) in the output. It may take a while before the import is fully processed and the IP address becomes available.

1. Open a browser window and visit the IP address. You should see a Hello World! message returned by the application. The message should also include the namespace and name of the endpoint (a pod), and the cluster where the pod comes from. 

1. Refresh the page multiple times and you will see that pods from both member clusters are exposed by the MultiClusterService and thus load balancing for incoming traffic is happening across all these pods.