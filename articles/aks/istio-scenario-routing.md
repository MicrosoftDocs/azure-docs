---
title: Intelligent routing and canary releases with Istio in Azure Kubernetes Service (AKS)
description: Learn how to use Istio to provide intelligent routing and deploy canary releases in an Azure Kubernetes Service (AKS) cluster
services: container-service
author: paulbouwer

ms.service: container-service
ms.topic: article
ms.date: 12/3/2018
ms.author: pabouwer
---

# Use intelligent routing and canary releases with Istio in Azure Kubernetes Service (AKS)

[Istio][istio-github] is an open-source service mesh that provides a key set of functionality across the microservices in a Kubernetes cluster. These features include traffic management, service identity and security, policy enforcement, and observability. For more information about Istio, see the official [What is Istio?][istio-docs-concepts] documentation.

This article shows you how to use the traffic management functionality of Istio. A sample AKS voting app is used to explore intelligent routing and canary releases.

In this article, you learn how to:

> [!div class="checklist"]
> * Deploy the application
> * Update the application
> * Roll out a canary release of the application
> * Finalize the rollout

## Before you begin

The steps detailed in this article assume you've created an AKS cluster (Kubernetes 1.10 and above, with RBAC enabled) and have established a `kubectl` connection with the cluster. You also need Istio installed in your cluster.

If you need help with any of these items, then see the [AKS quickstart][aks-quickstart] and [install Istio in AKS][istio-install].

## About this application scenario

The sample AKS voting app provides two voting options (Cats or Dogs) to users. There is a storage component that persists the number of votes for each option. Additionally, there is an analytics component that provides details around the votes cast for each option.

In this article, you start by deploying version `1.0` of the voting app and version `1.0` of the analytics component. The analytics component provides simple counts for the number of votes. The voting app and analytics component interact with version `1.0` of the storage component, which is backed by Redis.

You upgrade the analytics component to version `1.1`, which provides counts, and now totals and percentages.

A subset of users test version `2.0` of the app via a canary release. This new version uses a storage component that is backed by a MySQL database.

Once you're confident that version `2.0` works as expected on your subset of users, you roll out version `2.0` to all your users.

## Deploy the application

Let's start by deploying the application into your Azure Kubernetes Service (AKS) cluster. The following diagram shows what runs by the end of this section - version `1.0` of all components with inbound requests serviced via the Istio ingress gateway:

![The AKS Voting app components and routing.](media/istio/components-and-routing-01.png)

> [!IMPORTANT]
> The artifacts you need to follow along with this article are available in the [Azure-Samples/aks-voting-app][github-azure-sample] GitHub repo. You can either download the artifacts or clone the repo as follows:
>
> `git clone https://github.com/Azure-Samples/aks-voting-app.git`
>
> Ensure that you change to the following folder in the downloaded / cloned repo and run all subsequent steps from this folder.
>
> `cd scenarios/intelligent-routing-with-istio`

First, create a namespace in your AKS cluster for the sample AKS voting app named `voting` as follows:

```console
kubectl create namespace voting
```

The following example output shows the creation of the namespace:

```
namespace/voting created
```

Label the namespace with `istio-injection=enabled`. This label instructs Istio to automatically inject the istio-proxies as sidecars into all of your pods in this namespace.

```console
kubectl label namespace voting istio-injection=enabled
```

The following example output shows the namespace being labeled:

```console
namespace/voting labeled
```

Now let's create the components for the AKS Voting app. We'll make sure that we create these components within the `voting` namespace we created.

```azurecli
kubectl apply -f kubernetes/step-1-create-voting-app.yaml --namespace voting
```

The following example output shows the resources were successfully created:

```console
deployment.apps/voting-storage-1-0 created
service/voting-storage created
deployment.apps/voting-analytics-1-0 created
service/voting-analytics created
deployment.apps/voting-app-1-0 created
service/voting-app created
```

> [!NOTE]
> Istio has some specific requirements around pods and services. For more information, see the [Istio Requirements for Pods and Services documentation][istio-requirements-pods-and-services].

To see the pods that have been created, use the [kubectl get pods][kubectl get] command as follows:

```console
kubectl get pods -n voting
```

The following example output shows there are three instances of the `voting-app` pod and a single instance of both the `voting-analytics` and `voting-storage` pods. Each of the pods has two containers. One of these containers is the component, and the other is the `istio-proxy`:

```
NAME                                    READY     STATUS    RESTARTS   AGE
voting-analytics-1-0-669f99dcc8-lzh7k   2/2       Running   0          1m
voting-app-1-0-6c65c4bdd4-bdmld         2/2       Running   0          1m
voting-app-1-0-6c65c4bdd4-gcrng         2/2       Running   0          1m
voting-app-1-0-6c65c4bdd4-strzc         2/2       Running   0          1m
voting-storage-1-0-7954799d96-5fv9r     2/2       Running   0          1m
```

To see information about the pod, use the [kubectl describe pod][kubectl-describe]. Replace the pod name with the name of a pod in your own AKS cluster from the previous output:

```console
kubectl describe pod voting-app-1-0-6c65c4bdd4-bdmld --namespace voting
```

The`istio-proxy` container has automatically been injected by Istio to manage the network traffic to and from your components, as shown in the following example output:

```
[...]
Containers:
  voting-app:
    Image:         mcr.microsoft.com/aks/samples/voting/app:1.0
    ...
  istio-proxy:
    Image:         docker.io/istio/proxyv2:1.0.4
[...]
```

You can't connect to the voting app until you create the Istio [Gateway][istio-reference-gateway] and [Virtual Service][istio-reference-virtualservice]. These Istio resources route traffic from the default Istio ingress gateway to our application.

> [!NOTE]
> A *Gateway* is a component at the edge of the service mesh that receives inbound or outbound HTTP and TCP traffic.
>
> A *Virtual Service* defines a set of routing rules for one or more destination services.

Use the `istioctl` client binary to deploy the Gateway and Virtual Service yaml. As with the `kubectl apply` command, remember to specify the namespace that these resources are deployed into.

```console
istioctl create -f istio/step-1-create-voting-app-gateway.yaml --namespace voting
```

The following example output shows the Istio Gateway and Virtual Service were successfully created:

```
Created config virtual-service/voting/voting-app at revision 21486
Created config gateway/voting/voting-app-gateway at revision 21487
```

Obtain the IP address of the Istio Ingress Gateway using the following command:

```console
kubectl get service istio-ingressgateway --namespace istio-system -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

The following example output shows the IP address of the Ingress Gateway:

```
52.187.250.239
```

Open up a browser and paste in the IP address. The sample AKS voting app is displayed.

![The AKS Voting app running in our Istio enabled AKS cluster.](media/istio/deploy-app-01.png)

The information at the bottom of the screen shows that the app uses version `1.0` of the `voting-app` and version `1.0` (Redis) as the storage option.

## Update the application

We let's deploy a new version of the analytics component. This new version `1.1` displays totals and percentages in addition to the count for each category.

The following diagram shows what runs at the end of this section - only version `1.1` of our `voting-analytics` component has traffic routed from the `voting-app` component. Even though version `1.0` of our `voting-analytics` component continues to run and is referenced by the `voting-analytics` service, the Istio proxies disallow traffic to and from it.

![The AKS Voting app components and routing.](media/istio/components-and-routing-02.png)

Let's deploy version `1.1` of the `voting-analytics` component. Create this component in the `voting` namespace:

```console
kubectl apply -f kubernetes/step-2-update-voting-analytics-to-1.1.yaml --namespace voting
```

The following example output shows the resource are successfully created:

```
deployment.apps/voting-analytics-1-1 created
```

Open the sample AKS voting app in a browser again, using the IP address of the Istio Ingress Gateway obtained in the previous step.

Your browser alternates between the two views shown below. Since you are using a Kubernetes [Service][kubernetes-service] for the `voting-analytics` component with only a single label selector (`app: voting-analytics`), Kubernetes uses the default behavior of round-robin between the pods that match that selector. In this case, it is both version `1.0` and `1.1` of your `voting-analytics` pods.

![Version 1.0 of the analytics component running in our AKS Voting app.](media/istio/deploy-app-01.png)

![Version 1.1 of the analytics component running in our AKS Voting app.](media/istio/update-app-01.png)

You can visualize the switching between the two versions of the `voting-analytics` component as follows. Remember to use the IP address of your own Istio Ingress Gateway.

```console
INGRESS_IP=52.187.250.239
for i in {1..5}; do curl -si $INGRESS_IP | grep results; done
```

The following example output shows the relevant part of the returned web site as the site switches between versions:

```
  <div id="results"> Cats: 2 | Dogs: 4 </div>
  <div id="results"> Cats: 2 | Dogs: 4 </div>
  <div id="results"> Cats: 2/6 (33%) | Dogs: 4/6 (67%) </div>
  <div id="results"> Cats: 2 | Dogs: 4 </div>
  <div id="results"> Cats: 2/6 (33%) | Dogs: 4/6 (67%) </div>
```

### Lock down traffic to version 1.1 of the application

Now let's lock down traffic to only version `1.1` of the `voting-analytics` component and to version `1.0` of the `voting-storage` component. You then define routing rules for all of the other components.

You use the `istioctl` client binary to replace the Virtual Service definition on your `voting-app` and add [Destination Rules][istio-reference-destinationrule] and [Virtual Services][istio-reference-virtualservice] for the other components.

You also add a [Policy][istio-reference-policy] to the `voting` namespace to ensure that all communicate between services is secured using mutual TLS and client certificates.

> [!NOTE]
> A Virtual Service defines a set of routing rules for one or more destination services.
>
> A Destination Rule defines traffic policies and version specific policies.
>
> A Policy defines what authentication methods can be accepted on workload(s).

As there is an existing Virtual Service definition for `voting-app` that you replace, use the `istioctl replace` command as follows:

```console
istioctl replace -f istio/step-2a-update-voting-app-virtualservice.yaml --namespace voting
```

The following example output shows the Istio Virtual Service are successfully updated:

```
Updated config virtual-service/voting/voting-app to revision 141902
```

Next use the `istioctl create` command to add the new Policy and also the new Destination Rules and Virtual Services for all the other components.

The Policy has `peers.mtls.mode` set to `STRICT` to ensure that mutual TLS is enforced between your services within the `voting` namespace.

You also set the `trafficPolicy.tls.mode` to `ISTIO_MUTUAL` in all our Destination Rules. Istio provides services with strong identities and secures communications between services using mutual TLS and client certificates that Istio transparently manages.

```console
istioctl create -f istio/step-2b-add-routing-for-all-components.yaml --namespace voting
```

The following example output shows the new Policy, Destination Rules, and Virtual Services are successfully created:

```
Created config policy/voting/default to revision 142118
Created config destination-rule/voting/voting-app at revision 142119
Created config destination-rule/voting/voting-analytics at revision 142120
Created config virtual-service/voting/voting-analytics at revision 142121
Created config destination-rule/voting/voting-storage at revision 142122
Created config virtual-service/voting/voting-storage at revision 142123
```

If you open the AKS Voting app in a browser again, only the new version `1.1` of the `voting-analytics` component is used by the `voting-app` component.

![Version 1.1 of the analytics component running in our AKS Voting app.](media/istio/update-app-01.png)

You can more easily visualize that we are now only routed to version `1.1` of our `voting-analytics` component as follows. Remember to use the ip address of your Istio ingress gateway.

You can visualize that you are now only routed to version `1.1` of our `voting-analytics` component as follows. Remember to use the IP address of your own Istio Ingress Gateway:

```azurecli-interactive
INGRESS_IP=52.187.250.239
for i in {1..5}; do curl -si $INGRESS_IP | grep results; done
```

The following example output shows the relevant part of the returned web site:

```
  <div id="results"> Cats: 2/6 (33%) | Dogs: 4/6 (67%) </div>
  <div id="results"> Cats: 2/6 (33%) | Dogs: 4/6 (67%) </div>
  <div id="results"> Cats: 2/6 (33%) | Dogs: 4/6 (67%) </div>
  <div id="results"> Cats: 2/6 (33%) | Dogs: 4/6 (67%) </div>
  <div id="results"> Cats: 2/6 (33%) | Dogs: 4/6 (67%) </div>
```

Confirm that Istio uses mutual TLS to secure communications between each of our services. The following commands check the TLS settings for each of the `voting-app` services:

```console
istioctl authn tls-check voting-app.voting.svc.cluster.local
istioctl authn tls-check voting-analytics.voting.svc.cluster.local
istioctl authn tls-check voting-storage.voting.svc.cluster.local
```

This following example output shows that mutual TLS is enforced for each of the services via the Policy and Destination Rules:

```
HOST:PORT                                    STATUS     SERVER     CLIENT     AUTHN POLICY       DESTINATION RULE
voting-app.voting.svc.cluster.local:8080     OK         mTLS       mTLS       default/voting     voting-app/voting

HOST:PORT                                          STATUS     SERVER     CLIENT     AUTHN POLICY       DESTINATION RULE
voting-analytics.voting.svc.cluster.local:8080     OK         mTLS       mTLS       default/voting     voting-analytics/voting

HOST:PORT                                        STATUS     SERVER     CLIENT     AUTHN POLICY       DESTINATION RULE
voting-storage.voting.svc.cluster.local:6379     OK         mTLS       mTLS       default/voting     voting-storage/voting
```

## Roll out a canary release of the application

Now let's deploy a new version `2.0` of the `voting-app`, `voting-analytics`, and `voting-storage` components. The new `voting-storage` component leverage MySQL instead of Redis, and the `voting-app` and `voting-analytics` components are updated to allow them to leverage this new `voting-storage` component.

The `voting-app` component now supports feature flag functionality. This feature flag allows you to test the canary release capability of Istio for a subset of users.

The following diagram shows what runs at the end of this section.

* Version `1.0` of the `voting-app` component, version `1.1` of the `voting-analytics` component and version `1.0` of the `voting-storage` component are able to communicate with each other.
* Version `2.0` of the `voting-app` component, version `2.0` of the `voting-analytics` component and version `2.0` of the `voting-storage` component are able to communicate with each other.
* Version `2.0` of the `voting-app` component are only accessible to users that have a specific feature flag set. This change is managed using a feature flag via a cookie.

![The AKS Voting app components and routing.](media/istio/components-and-routing-03.png)

First, update the Istio Destination Rules and Virtual Services to cater for these new components. These updates ensure that you don't route traffic incorrectly to the new components and users don't get unexpected access:

```console
istioctl replace -f istio/step-3-add-routing-for-2.0-components.yaml --namespace voting
```

The following example output shows the Destination Rules and Virtual Services are successfully updated:

```
Updated config destination-rule/voting/voting-app to revision 150930
Updated config virtual-service/voting/voting-app to revision 150931
Updated config destination-rule/voting/voting-analytics to revision 150937
Updated config virtual-service/voting/voting-analytics to revision 150939
Updated config destination-rule/voting/voting-storage to revision 150940
Updated config virtual-service/voting/voting-storage to revision 150941
```

Next, let's add the Kubernetes objects for the new version `2.0` components. You also update the `voting-storage` service to include the `3306` port for MySQL:

```console
kubectl apply -f kubernetes/step-3-update-voting-app-with-new-storage.yaml --namespace voting
```

The following example output shows the Kubernetes objects are successfully updated or created:

```
service/voting-storage configured
secret/voting-storage-secret created
deployment.apps/voting-storage-2-0 created
persistentvolumeclaim/mysql-pv-claim created
deployment.apps/voting-analytics-2-0 created
deployment.apps/voting-app-2-0 created
```

Wait until all the version `2.0` pods are running. Use the [kubectl get pods][kubectl-get] command to view all pods in the *voting* namespace:

```azurecli-interactive
kubectl get pods --namespace voting
```

You should now be able to switch between the version `1.0` and version `2.0` (canary) of the voting application. The feature flag toggle at the bottom of the screen sets a cookie. This cookie is used by the `voting-app` Virtual Service to route users to the new version `2.0`.

![Version 1.0 of the AKS Voting app - feature flag IS NOT set.](media/istio/canary-release-01.png)

![Version 2.0 of the AKS Voting app - feature flag IS set.](media/istio/canary-release-02.png)

The vote counts are different between the versions of the app. This difference highlights that you are using two different storage backends.

## Finalize the rollout

Once you've successfully tested the canary release, update the `voting-app` Virtual Service to route all traffic to version `2.0` of the `voting-app` component. All users then see version `2.0` of the application, regardless of whether the feature flag is set or not:

![The AKS Voting app components and routing.](media/istio/components-and-routing-04.png)

Update all the Destination Rules to remove the versions of the components you no longer want active. Then, update all the Virtual Services to stop referencing those versions.

Since there's no longer any traffic to any of the older versions of the components, you can now safely delete all the deployments for those components.

![The AKS Voting app components and routing.](media/istio/components-and-routing-05.png)

You have now successfully rolled out a new version of the AKS Voting App.

## Next steps

You can also explore additional scenarios using the Bookinfo Application example on the Istio site.

> [!div class="nextstepaction"]
> [Istio Bookinfo Application example][istio-bookinfo-example]


<!-- LINKS - external -->
[github-azure-sample]: https://github.com/Azure-Samples/aks-voting-app
[istio]: https://istio.io
[istio-docs-concepts]: https://istio.io/docs/concepts/what-is-istio/
[istio-github]: https://github.com/istio/istio
[istio-requirements-pods-and-services]: https://istio.io/docs/setup/kubernetes/spec-requirements/
[istio-reference-gateway]: https://istio.io/docs/reference/config/istio.networking.v1alpha3/#Gateway
[istio-reference-policy]: https://istio.io/docs/reference/config/istio.authentication.v1alpha1/#Policy
[istio-reference-virtualservice]: https://istio.io/docs/reference/config/istio.networking.v1alpha3/#VirtualService
[istio-reference-destinationrule]: https://istio.io/docs/reference/config/istio.networking.v1alpha3/#DestinationRule
[kubernetes-service]: https://kubernetes.io/docs/concepts/services-networking/service/
[istio-bookinfo-example]: https://istio.io/docs/examples/bookinfo/
[kubectl get]:
[kubectl-describe]:

<!-- LINKS - internal -->
[aks-quickstart]: ./kubernetes-walkthrough.md
[istio-install]: ./istio-install.md
