---
title: Intelligent routing and canary releases with Istio
description: Use Istio to provide Intelligent routing and deploy canary releases in an Azure Kubernetes Service (AKS) cluster
services: container-service
author: paulbouwer

ms.service: container-service
ms.topic: article
ms.date: 08/10/2018
ms.author: pabouwer
---

# Intelligent routing and canary releases with Istio

[Istio][istio-github] is an open-source service mesh that provides a key set of functionality across the microservices within your Kubernetes cluster. These include traffic management, service identity & security, policy enforcement, and observability. For a deeper conceptual understanding of Istio, see the official [What is Istio?][istio-docs-concepts] documentation.

This article will show you how you can use the traffic management functionality of Istio. We'll use the Azure Voting app that you have become familiar with in the Azure Kubernetes Service (AKS) documentation to explore intelligent routing and canary releases. 

We'll be working through the following tasks in this article:

> [!div class="checklist"]
> * Deploy the application
> * Update the application
> * Roll out a canary release of the application
> * Finalize the rollout

## Before you begin

The steps detailed in this document assume you've created an AKS cluster and have established a `kubectl` connection with the cluster. If you need these items see, the [AKS quickstart][aks-quickstart].

## What will we be doing?

The Azure Voting app provides two voting options (Cats or Dogs) to users. There is a storage component that persists the number of votes for each option. Additionally, we have an analytics component that provides details around the votes cast for each option.

In this article, we'll start by deploying version `1.0` of the voting app and version `1.0` of the analytics component. The analytics component will provide simple counts for the number of votes. The voting app and analytics component will interact with version `1.0` of the storage component, which will be backed by redis.

We'll then upgrade the analytics component to version `1.1`, which will provide counts, totals and percentages.

Then we'll test version `2.0` on a subset of our users via a canary release. This new version will use a storage component that is backed by a MySQL database.

Once we're confident that version `2.0` works as expected on our subset of users, then we'll roll out version `2.0` to all our users.

## Deploy the application

Let's start by deploying the application into our Azure Kubernetes Service (AKS) cluster. The following diagram shows what we will have running at the end of this section - version `1.0` of all our components with inbound requests serviced via the istio ingress gateway.

![The Azure Vote application components and routing.](media/istio/components-and-routing-01.png)

> TODO
>
> GitHub repo - clone the application to get the yaml or just reference via url from github?
>
> https://github.com/paulbouwer/votingapp-servicemesh-sample

Create a namespace in our AKS cluster for the Azure Voting application. We'll call it `azurevote` and add it as follows:

```azurecli-interactive
kubectl create namespace azurevote
```

The following example output shows the creation of the namespace:

```console
namespace "azurevote" created
```

We'll need to label the namespace with `istio-injection=enabled`. This label instructs Istio to automatically inject the istio-proxies as sidecars into all of our pods within this namespace.

```azurecli-interactive
kubectl label namespace azurevote istio-injection=enabled
```

The following example output shows the namespace being labeled:

```console
namespace "azurevote" labeled
```

Now let's create the components for the Azure Vote application. We'll make sure that we create these components within the `azurevote` namespace we created.

```azurecli-interactive
kubectl apply -f kubernetes/step-1-create-voting-app.yaml --namespace azurevote
```

The following example output shows the resources being created:

```console
deployment.apps "voting-storage-1-0" created
service "voting-storage" created
deployment.apps "voting-analytics-1-0" created
service "voting-analytics" created
deployment.apps "voting-app-1-0" created
service "voting-app" created
```

> [!NOTE]
> Istio has some specific requirements around pods and services. Read about them in the Istio Requirements for Pods and Services [documentation][istio-requirements-pods-and-services].

You can see the pods that have been created by running the following command:

```azurecli-interactive
kubectl get pods -n azurevote
```

The following example output shows that we have three instances of the `voting-app` pod and single instances of both the `voting-analytics` and `voting-storage` pods. You can also see that each of our pods has two containers. One of these containers is our component and the other is the `istio-proxy`:

```console
NAME                                    READY     STATUS    RESTARTS   AGE
voting-analytics-1-0-557674975f-4wbz7   2/2       Running   0          53s
voting-app-1-0-d6d75846b-744bz          2/2       Running   0          52s
voting-app-1-0-d6d75846b-k57c9          2/2       Running   0          52s
voting-app-1-0-d6d75846b-thh75          2/2       Running   0          52s
voting-storage-1-0-f775b5df7-bsx4l      2/2       Running   0          53s
```

Run the following command. Replace the pod name with the name of a pod in your AKS cluster:

```azurecli-interative
kubectl describe pod voting-app-1-0-d6d75846b-744bz -n azurevote
```

You'll be able to see the `istio-proxy` container that has automatically been injected by Istio to manage the network traffic to and from your components.

```console
...
Containers:
  voting-app:
    Image:         mcr.microsoft.com/aks/samples/voting-app/app:1.0
    ...
  istio-proxy:
    Image:         docker.io/istio/proxyv2:1.0.0
...
```

Now, we still cannot connect to our voting app until we create the Istio [Gateway][istio-reference-gateway] and [Virtual Service][istio-reference-virtualservice]. We'll use these two Istio resources to route traffic from the default Istio ingress gateway to our application.

> [!NOTE]
> A Gateway is a component at the edge of the service mesh that receives inbound or outbound http and tcp traffic.
>
> A Virtual Service defines a set of routing rules for one or more destination services.

We'll use the `istioctl` client binary to deploy the Gateway and Virtual Service yaml. As with the `kubectl apply` command, we must remember to specify the namespace that these resources will be deployed into.

```azurecli-interactive
istioctl create -f istio/step-1-create-voting-app-gateway.yaml --namespace azurevote
```

The following example output shows the Istio Gateway and Virtual Service being created:

```console
Created config virtual-service/azurevote/voting-app at revision 3576
Created config gateway/azurevote/voting-app-gateway at revision 3578
```

Obtain the ip address of the Istio Ingress Gateway using the following command:

```azurecli-interactive
kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

The following example output shows the returned ip address of the Ingress Gateway:

```console
52.187.229.139
```

Open up a browser and paste in the ip address. You will see the Azure Vote application.

The information at the bottom of the screen shows that we are using version `1.0` of the `voting-app` and using version `1.0` (redis) as the storage option.

![The Azure Vote application running in our Istio enabled AKS cluster.](media/istio/deploy-app-01.png)

## Update the application

We now want to deploy a new version of the analytics component. This new version `1.1` will display totals and percentages in addition to the count for each category.

The following diagram shows what we will have running at the end of this section - only version `1.1` of our `voting-analytics` component will have allowed routing. Even though version `1.0` of our `voting-analytics` component is still deployed and referenced by the `voting-analytics` service, the Istio proxies are disallowing traffic to and from it.

![The Azure Vote application components and routing.](media/istio/components-and-routing-02.png)

Now let's deploy version `1.1` of the `voting-analytics` component. We'll make sure that we create this component within the `azurevote` namespace.

```azurecli-interactive
kubectl apply -f kubernetes/step-2-update-voting-analytics-to-1.1.yaml --namespace azurevote
```

The following example output shows the resource being created:

```console
deployment.apps "voting-analytics-1-1" created
```

Open the Azure Vote application in a browser again, using the ip address of the Istio Ingress Gateway that you obtained earlier.

Your browser will alternate between the two views shown below every time you hit refresh. Since we are using a Kubernetes [Service][kubernetes-service] for the `voting-analytics` component with only a single label selector (`app: voting-analytics`), we will observe Kubernetes' default behavior of round-robining between the pods that match that selector. In this case, it is both version `1.0` and `1.1` of our `voting-analytics` pods.

![Version 1.0 of the analytics component running in our Azure Vote application.](media/istio/deploy-app-01.png)

![Version 1.1 of the analytics component running in our Azure Vote application.](media/istio/update-app-01.png)

You can more easily visualize the switching between the two versions of the `voting-analytics` component as follows. Remember to use the ip address of your Istio Ingress Gateway.

```azurecli-interactive
INGRESS_IP=13.70.126.16
for i in {1..5}; do curl -si $INGRESS_IP | grep results; done
```

The following example output shows the relevant part of the returned web site:

```console
  <div id="results"> Cats: 2 | Dogs: 4 </div>
  <div id="results"> Cats: 2 | Dogs: 4 </div>
  <div id="results"> Cats: 2/6 (33%) | Dogs: 4/6 (67%) </div>
  <div id="results"> Cats: 2 | Dogs: 4 </div>
  <div id="results"> Cats: 2/6 (33%) | Dogs: 4/6 (67%) </div>
```

Let's lock down traffic to only version `1.1` of our `voting-analytics` component and to version `1.0` or our `voting-storage` component. We will also need to define routing rules for all of the other components, otherwise routing will not work.

We'll use the `istioctl` client binary to replace the Virtual Service definition on our `voting-app` and add [Destination Rules][istio-reference-destinationrule] and [Virtual Services][istio-reference-virtualservice] for the other components.

> [!NOTE]
> A Virtual Service defines a set of routing rules for one or more destination services.
>
> A Destination Rule defines traffic policies and version specific policies.

We will be using the `istioctl replace` command since we have an existing Virtual Service definition for `voting-app` that we are replacing.

```azurecli-interactive
istioctl replace -f istio/step-2a-update-voting-app-virtualservice.yaml --namespace azurevote
```

The following example output shows the Istio Virtual Service being updated:

```console
Updated config virtual-service/azurevote/voting-app to revision 4236
```

Next we'll use the `istioctl create` command to add all the new Destination Rules and Virtual Services for all the other components. 

We also ensure that we have set the `trafficPolicy.tls.mode` to `ISTIO_MUTUAL` in all our Destination Rules. Istio will ensure that our services are given strong identities and only allow approved services to communicate with each other.

```azurecli-interactive
istioctl create -f istio/step-2b-add-routing-for-all-components.yaml --namespace azurevote
```

The following example output shows the new Destination Rules and Virtual Services being created:

```console
Created config destination-rule/azurevote/voting-app at revision 4341
Created config destination-rule/azurevote/voting-analytics at revision 4342
Created config virtual-service/azurevote/voting-analytics at revision 4343
Created config destination-rule/azurevote/voting-storage at revision 4344
Created config virtual-service/azurevote/voting-storage at revision 4345
```

If you open the Azure Voting application in a browser again, your will see that only the new version `1.1` of the `voting-analytics` component is being used by the `voting-app` component.

![Version 1.1 of the analytics component running in our Azure Vote application.](media/istio/update-app-01.png)

You can more easily visualize that we are now only routed to version `1.1` of our `voting-analytics` component as follows. Remember to use the ip address of your Istio ingress gateway.

```azurecli-interactive
INGRESS_IP=13.70.126.16
for i in {1..5}; do curl -si $INGRESS_IP | grep results; done
```

The following example output shows the relevant part of the returned web site:

```console
  <div id="results"> Cats: 2/6 (33%) | Dogs: 4/6 (67%) </div>
  <div id="results"> Cats: 2/6 (33%) | Dogs: 4/6 (67%) </div>
  <div id="results"> Cats: 2/6 (33%) | Dogs: 4/6 (67%) </div>
  <div id="results"> Cats: 2/6 (33%) | Dogs: 4/6 (67%) </div>
  <div id="results"> Cats: 2/6 (33%) | Dogs: 4/6 (67%) </div>
```

## Roll out a canary release of the application

We want to deploy a new version `2.0` of the `voting-app`, `voting-analytics`, and `voting-storage` components. The new `voting-storage` component will leverage MySQL instead of Redis, and the `voting-app` and `voting-analytics` components are updated to allow them to leverage this new `voting-storage` component.

The `voting-app` component will now support feature flag functionality. This feature flag will allow us to test the canary release capability of Istio for a subset of users.

The following diagram shows what we will have running at the end of this section. Version `1.0` of the `voting-app` component, version `1.1` of the `voting-analytics` component and version `1.0` of the `voting-storage` component will be able to communicate with each other. Version `2.0` of the `voting-app` component, version `2.0` of the `voting-analytics` component and version `2.0` of the `voting-storage` component will be able to communicate with each other. Version `2.0` of the `voting-app` component will only be accessible to users who have a specific feature flag set. We will manage this feature flag via a cookie.

![The Azure Vote application components and routing.](media/istio/components-and-routing-03.png)

First we will update the Istio Destination Rules and Virtual Services to cater for these new components. These updates will ensure that we don't route traffic incorrectly to the new components and users don't get unexpected access.

```azurecli-interactive
istioctl replace -f istio/step-3-add-routing-for-2.0-components.yaml --namespace azurevote
```

The following example output shows the Destination Rules and Virtual Services being updated:

```console
Updated config destination-rule/azurevote/voting-app to revision 232410
Updated config virtual-service/azurevote/voting-app to revision 232412
Updated config destination-rule/azurevote/voting-analytics to revision 232413
Updated config virtual-service/azurevote/voting-analytics to revision 232414
Updated config destination-rule/azurevote/voting-storage to revision 232415
Updated config virtual-service/azurevote/voting-storage to revision 232416
```

Next, let's add the Kubernetes objects for the new version `2.0` components. We will also update the `voting-storage` service to include the `3306` port for MySQL.

```azurecli-interactive
kubectl apply -f kubernetes/step-3-update-voting-app-with-new-storage.yaml --namespace azurevote
```

The following example output shows the Kubernetes objects being updated or created:

```console
service "voting-storage" configured
secret "voting-storage-secret" created
deployment.apps "voting-storage-2-0" created
persistentvolumeclaim "mysql-pv-claim" created
deployment.apps "voting-analytics-2-0" created
deployment.apps "voting-app-2-0" created
```

You should now be able to switch between the version `1.0` and version `2.0` (canary) of the voting application. The feature flag toggle at the bottom of the screen will set a cookie. This cookie is used by the `voting-app` Virtual Service to route users to the new version `2.0`.

The other thing that you may notice, is that vote counts are different between the versions of the app. This difference highlights that we are using two different storage backends.

![Version 1.0 of the Azure Voting application - feature flag IS NOT set.](media/istio/canary-release-01.png)

![Version 2.0 of the Azure Voting application - feature flag IS set.](media/istio/canary-release-02.png)

## Finalize the rollout

Once we've successfully tested our canary release, we can update the `voting-app` Virtual Service to route all traffic to version `2.0` of the `voting-app` component. All users will now see version `2.0` of the application, regardless of whether the feature flag is set or not.

![The Azure Vote application components and routing.](media/istio/components-and-routing-04.png)

Next update all the Destination Rules to remove the versions of the components you no longer want active. Then, update all the Virtual Services to stop referencing those versions.

Since there's no longer any traffic to any of the older versions of the components, you can now safely delete all the deployments for those components.

![The Azure Vote application components and routing.](media/istio/components-and-routing-05.png)

You have now successfully rolled out a new version of the Azure Voting App.

## Next steps

You can also explore additional scenarios using the Bookinfo Application example on the Istio site.

> [!div class="nextstepaction"]
> [Istio Bookinfo Application example][istio-bookinfo-example]


<!-- LINKS - external -->
[istio]: https://istio.io
[istio-docs-concepts]: https://istio.io/docs/concepts/what-is-istio/
[istio-github]: https://github.com/istio/istio
[istio-requirements-pods-and-services]: https://istio.io/docs/setup/kubernetes/spec-requirements/
[istio-reference-gateway]: https://istio.io/docs/reference/config/istio.networking.v1alpha3/#Gateway
[istio-reference-virtualservice]: https://istio.io/docs/reference/config/istio.networking.v1alpha3/#VirtualService
[istio-reference-destinationrule]: https://istio.io/docs/reference/config/istio.networking.v1alpha3/#DestinationRule
[kubernetes-service]: https://kubernetes.io/docs/concepts/services-networking/service/
[istio-bookinfo-example]: https://istio.io/docs/examples/bookinfo/

<!-- LINKS - internal -->
[aks-quickstart]: ./kubernetes-walkthrough.md
