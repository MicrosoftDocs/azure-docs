---
title: HTTP application routing add-on for Azure Kubernetes Service (AKS) (retired)
description: Use the HTTP application routing add-on to access applications deployed on Azure Kubernetes Service (AKS) (retired).
ms.subservice: aks-networking
ms.custom: devx-track-azurecli, devx-track-linux
author: asudbring
ms.topic: how-to
ms.date: 04/05/2023
ms.author: allensu
---

# HTTP application routing add-on for Azure Kubernetes Service (AKS) (retired)

> [!CAUTION]
> HTTP application routing add-on (preview) for Azure Kubernetes Service (AKS) will be [retired](https://azure.microsoft.com/updates/retirement-http-application-routing-addon-preview-for-aks-will-retire-03032025) on 03 March 2025. We recommend migrating to the [Application Routing add-on](./app-routing-migration.md) by that date.

The HTTP application routing add-on makes it easy to access applications that are deployed to your Azure Kubernetes Service (AKS) cluster by:

* Configuring an [ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) in your AKS cluster.
* Creating publicly accessible DNS names for application endpoints
* Creating a DNS zone in your subscription. For more information about DNS cost, see [DNS pricing][dns-pricing].

## Before you begin

* The HTTP application routing add-on doesn't work with AKS versions 1.22.6+.
* If you're running commands locally, install [`kubectl`][kubectl] using the [`az aks install-cli`][az-aks-install-cli] command.

## HTTP application routing add-on overview

The add-on deploys two components: a [Kubernetes ingress controller][ingress] and an [External-DNS][external-dns] controller.

* **Ingress controller**: The ingress controller is exposed to the internet using a Kubernetes `LoadBalancer` service. The ingress controller watches and implements [Kubernetes ingress resources][ingress-resource] and creates routes to application endpoints.
* **External-DNS controller**: The External-DNS controller watches for Kubernetes ingress resources and creates DNS `A` records in the cluster-specific DNS zone.

## Enable HTTP application routing

1. Create a new AKS cluster and enable the HTTP application routing add-on using the [`az aks create`][az-aks-create] command with the `--enable-addons` parameter.

    ```azurecli-interactive
    az aks create --resource-group myResourceGroup --name myAKSCluster --enable-addons http_application_routing
    ```

    You can also enable HTTP routing on an existing AKS cluster using the [`az aks enable-addons`][az-aks-enable-addons] command with the `--addons` parameter.

    ```azurecli-interactive
    az aks enable-addons --resource-group myResourceGroup --name myAKSCluster --addons http_application_routing
    ```

2. Retrieve the DNS zone name using the [`az aks show`][az-aks-show] command. You need the DNS zone name to deploy applications to the cluster.

    ```azurecli-interactive
    az aks show --resource-group myResourceGroup --name myAKSCluster --query addonProfiles.httpApplicationRouting.config.HTTPApplicationRoutingZoneName -o table
    ```

    Your output should look like the following example output:

    ```output
    9f9c1fe7-21a1-416d-99cd-3543bb92e4c3.eastus.aksapp.io
    ```

## Connect to your AKS cluster

* Configure `kubectl` to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command. The following example gets credentials for the AKS cluster named *myAKSCluster* in the *myResourceGroup*:

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

## Use HTTP application routing

> [!IMPORTANT]
> The HTTP application routing add-on can only be triggered on ingress resources with the following annotation:
>
> ```yaml
> annotations:
>  kubernetes.io/ingress.class: addon-http-application-routing
> ```

1. Create a file named **samples-http-application-routing.yaml** and copy in the following YAML. On line 43, update `<CLUSTER_SPECIFIC_DNS_ZONE>` with the DNS zone name you collected in the previous step.

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: aks-helloworld  
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: aks-helloworld
      template:
        metadata:
          labels:
            app: aks-helloworld
        spec:
          containers:
          - name: aks-helloworld
            image: mcr.microsoft.com/azuredocs/aks-helloworld:v1
            ports:
            - containerPort: 80
            env:
            - name: TITLE
              value: "Welcome to Azure Kubernetes Service (AKS)"
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: aks-helloworld  
    spec:
      type: ClusterIP
      ports:
     - port: 80
      selector:
        app: aks-helloworld
    ---
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: aks-helloworld
      annotations:
        kubernetes.io/ingress.class: addon-http-application-routing
    spec:
      rules:
     - host: aks-helloworld.<CLUSTER_SPECIFIC_DNS_ZONE>
        http:
          paths:
          - path: /
            pathType: Prefix
            backend:
              service: 
                name: aks-helloworld
                port: 
                  number: 80
    ```

2. Create the resources using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f samples-http-application-routing.yaml
    ```

    The following example shows the created resources:

    ```output
    deployment.apps/aks-helloworld created
    service/aks-helloworld created
    ingress.networking.k8s.io/aks-helloworld created
    ```

3. Open a web browser to *aks-helloworld.\<CLUSTER_SPECIFIC_DNS_ZONE\>*, for example *aks-helloworld.9f9c1fe7-21a1-416d-99cd-3543bb92e4c3.eastus.aksapp.io* and verify you see the demo application. The application may take a few minutes to appear.

## Remove HTTP application routing

1. Remove the HTTP application routing add-on using the [`az aks disable-addons][az-aks-disable-addons] command with the `addons` parameter.

    ```azurecli-interactive
    az aks disable-addons --addons http_application_routing --name myAKSCluster --resource-group myResourceGroup --no-wait
    ```

2. When the HTTP application routing add-on is disabled, some Kubernetes resources may remain in the cluster. These resources include *configmaps* and *secrets* and are created in the *kube-system* namespace. To maintain a clean cluster, you may want to remove these resources. Look for *addon-http-application-routing* resources using the following [`kubectl get`][kubectl-get] commands:

    ```bash
    kubectl get deployments --namespace kube-system
    kubectl get services --namespace kube-system
    kubectl get configmaps --namespace kube-system
    kubectl get secrets --namespace kube-system
    ```

    The following example output shows *configmaps* that should be deleted:

    ```output
    NAMESPACE     NAME                                                       DATA   AGE
    kube-system   addon-http-application-routing-nginx-configuration         0      9m7s
    kube-system   addon-http-application-routing-tcp-services                0      9m7s
    kube-system   addon-http-application-routing-udp-services                0      9m7s
    ```

3. Delete remaining resources using the [`kubectl delete`][kubectl-delete] command. Make sure to specify the resource type, resource name, and namespace. The following example deletes one of the previous configmaps:

    ```bash
    kubectl delete configmaps addon-http-application-routing-nginx-configuration --namespace kube-system
    ```

4. Repeat the previous `kubectl delete` step for all *addon-http-application-routing* resources remaining in your cluster.

## Troubleshoot

1. View the application logs for the External-DNS application using the [`kubectl logs`][kubectl-logs] command.

    ```bash
    kubectl logs -f deploy/addon-http-application-routing-external-dns -n kube-system
    ```

    The logs should confirm that an `A` and `TXT` DNS record were created successfully, as shown in the following example output:

    ```output
    time="2018-04-26T20:36:19Z" level=info msg="Updating A record named 'aks-helloworld' to '52.242.28.189' for Azure DNS zone '471756a6-e744-4aa0-aa01-89c4d162a7a7.canadaeast.aksapp.io'."
    time="2018-04-26T20:36:21Z" level=info msg="Updating TXT record named 'aks-helloworld' to '"heritage=external-dns,external-dns/owner=default"' for Azure DNS zone '471756a6-e744-4aa0-aa01-89c4d162a7a7.canadaeast.aksapp.io'."
    ```

2. View the application logs for the NGINX ingress controller using the [`kubectl logs`][kubectl-logs] command.

    ```bash
    kubectl logs -f deploy/addon-http-application-routing-nginx-ingress-controller -n kube-system
    ```

    The logs should confirm the `CREATE` of an ingress resource and the reload of the controller, as shown in the following example output:

    ```output
    -------------------------------------------------------------------------------
    NGINX Ingress controller
      Release:    0.13.0
      Build:      git-4bc943a
      Repository: https://github.com/kubernetes/ingress-nginx
    -------------------------------------------------------------------------------

    I0426 20:30:12.212936       9 flags.go:162] Watching for ingress class: addon-http-application-routing
    W0426 20:30:12.213041       9 flags.go:165] only Ingress with class "addon-http-application-routing" will be processed by this ingress controller
    W0426 20:30:12.213505       9 client_config.go:533] Neither --kubeconfig nor --master was specified.  Using the inClusterConfig.  This might not work.
    I0426 20:30:12.213752       9 main.go:181] Creating API client for https://10.0.0.1:443
    I0426 20:30:12.287928       9 main.go:225] Running in Kubernetes Cluster version v1.8 (v1.8.11) - git (clean) commit 1df6a8381669a6c753f79cb31ca2e3d57ee7c8a3 - platform linux/amd64
    I0426 20:30:12.290988       9 main.go:84] validated kube-system/addon-http-application-routing-default-http-backend as the default backend
    I0426 20:30:12.294314       9 main.go:105] service kube-system/addon-http-application-routing-nginx-ingress validated as source of Ingress status
    I0426 20:30:12.426443       9 stat_collector.go:77] starting new nginx stats collector for Ingress controller running in namespace  (class addon-http-application-routing)
    I0426 20:30:12.426509       9 stat_collector.go:78] collector extracting information from port 18080
    I0426 20:30:12.448779       9 nginx.go:281] starting Ingress controller
    I0426 20:30:12.463585       9 event.go:218] Event(v1.ObjectReference{Kind:"ConfigMap", Namespace:"kube-system", Name:"addon-http-application-routing-nginx-configuration", UID:"2588536c-4990-11e8-a5e1-0a58ac1f0ef2", APIVersion:"v1", ResourceVersion:"559", FieldPath:""}): type: 'Normal' reason: 'CREATE' ConfigMap kube-system/addon-http-application-routing-nginx-configuration
    I0426 20:30:12.466945       9 event.go:218] Event(v1.ObjectReference{Kind:"ConfigMap", Namespace:"kube-system", Name:"addon-http-application-routing-tcp-services", UID:"258ca065-4990-11e8-a5e1-0a58ac1f0ef2", APIVersion:"v1", ResourceVersion:"561", FieldPath:""}): type: 'Normal' reason: 'CREATE' ConfigMap kube-system/addon-http-application-routing-tcp-services
    I0426 20:30:12.467053       9 event.go:218] Event(v1.ObjectReference{Kind:"ConfigMap", Namespace:"kube-system", Name:"addon-http-application-routing-udp-services", UID:"259023bc-4990-11e8-a5e1-0a58ac1f0ef2", APIVersion:"v1", ResourceVersion:"562", FieldPath:""}): type: 'Normal' reason: 'CREATE' ConfigMap kube-system/addon-http-application-routing-udp-services
    I0426 20:30:13.649195       9 nginx.go:302] starting NGINX process...
    I0426 20:30:13.649347       9 leaderelection.go:175] attempting to acquire leader lease  kube-system/ingress-controller-leader-addon-http-application-routing...
    I0426 20:30:13.649776       9 controller.go:170] backend reload required
    I0426 20:30:13.649800       9 stat_collector.go:34] changing prometheus collector from  to default
    I0426 20:30:13.662191       9 leaderelection.go:184] successfully acquired lease kube-system/ingress-controller-leader-addon-http-application-routing
    I0426 20:30:13.662292       9 status.go:196] new leader elected: addon-http-application-routing-nginx-ingress-controller-5cxntd6
    I0426 20:30:13.763362       9 controller.go:179] ingress backend successfully reloaded...
    I0426 21:51:55.249327       9 event.go:218] Event(v1.ObjectReference{Kind:"Ingress", Namespace:"default", Name:"aks-helloworld", UID:"092c9599-499c-11e8-a5e1-0a58ac1f0ef2", APIVersion:"extensions", ResourceVersion:"7346", FieldPath:""}): type: 'Normal' reason: 'CREATE' Ingress default/aks-helloworld
    W0426 21:51:57.908771       9 controller.go:775] service default/aks-helloworld does not have any active endpoints
    I0426 21:51:57.908951       9 controller.go:170] backend reload required
    I0426 21:51:58.042932       9 controller.go:179] ingress backend successfully reloaded...
    167.220.24.46 - [167.220.24.46] - - [26/Apr/2018:21:53:20 +0000] "GET / HTTP/1.1" 200 234 "" "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)" 197 0.001 [default-aks-helloworld-80] 10.244.0.13:8080 234 0.004 200
    ```

## Clean up resources

* Remove the associated Kubernetes objects created in this article using the `kubectl delete` command.

    ```bash
    kubectl delete -f samples-http-application-routing.yaml
    ```

    The following example output shows Kubernetes objects have been removed:

    ```output
    deployment "aks-helloworld" deleted
    service "aks-helloworld" deleted
    ingress "aks-helloworld" deleted
    ```

## Next steps

For information on how to install an HTTPS-secured ingress controller in AKS, see [HTTPS ingress on Azure Kubernetes Service (AKS)][ingress-https].

<!-- LINKS - internal -->
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-show]: /cli/azure/aks#az-aks-show
[ingress-https]: ./ingress-tls.md
[az-aks-enable-addons]: /cli/azure/aks#az-aks-enable-addons
[az-aks-disable-addons]: /cli/azure/aks#az-aks-disable-addons
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials

<!-- LINKS - external -->
[dns-pricing]: https://azure.microsoft.com/pricing/details/dns/
[external-dns]: https://github.com/kubernetes-incubator/external-dns
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-logs]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs
[ingress]: https://kubernetes.io/docs/concepts/services-networking/ingress/
[ingress-resource]: https://kubernetes.io/docs/concepts/services-networking/ingress/#the-ingress-resource
