---
title: Best practices for cluster security
titleSuffix: Azure Kubernetes Service
description: Learn the cluster operator best practices for how to manage cluster security and upgrades in Azure Kubernetes Service (AKS)
ms.topic: conceptual
ms.date: 03/02/2023

---

# Best practices for cluster security and upgrades in Azure Kubernetes Service (AKS)

As you manage clusters in Azure Kubernetes Service (AKS), workload and data security is a key consideration. When you run multi-tenant clusters using logical isolation, you especially need to secure resource and workload access. Minimize the risk of attack by applying the latest Kubernetes and node OS security updates.

This article focuses on how to secure your AKS cluster. You learn how to:

> [!div class="checklist"]
> * Use Azure Active Directory and Kubernetes role-based access control (Kubernetes RBAC) to secure API server access.
> * Secure container access to node resources.
> * Upgrade an AKS cluster to the latest Kubernetes version.
> * Keep nodes up to date and automatically apply security patches.

You can also read the best practices for [container image management][best-practices-container-image-management] and for [pod security][best-practices-pod-security].

## Enable threat protection

> **Best practice guidance**
>
> You can enable [Defender for Containers](../defender-for-cloud/defender-for-containers-introduction.md) to help secure your containers. Defender for Containers can assess cluster configurations and provide security recommendations, run vulnerability scans, and provide real-time protection and alerting for Kubernetes nodes and clusters.

## Secure access to the API server and cluster nodes

> **Best practice guidance**
>
> One of the most important ways to secure your cluster is to secure access to the Kubernetes API server. To control access to the API server, integrate Kubernetes RBAC with Azure Active Directory (Azure AD). With these controls,you secure AKS the same way that you secure access to your Azure subscriptions.

The Kubernetes API server provides a single connection point for requests to perform actions within a cluster. To secure and audit access to the API server, limit access and provide the lowest possible permission levels. while this approach isn't unique to Kubernetes, it's especially important when you've logically isolated your AKS cluster for multi-tenant use.

Azure AD provides an enterprise-ready identity management solution that integrates with AKS clusters. Since Kubernetes doesn't provide an identity management solution, you may be hard-pressed to granularly restrict access to the API server. With Azure AD-integrated clusters in AKS, you use your existing user and group accounts to authenticate users to the API server.

![Azure Active Directory integration for AKS clusters](media/operator-best-practices-cluster-security/aad-integration.png)

Using Kubernetes RBAC and Azure AD-integration, you can secure the API server and provide the minimum permissions required to a scoped resource set, like a single namespace. You can grant different Azure AD users or groups different Kubernetes roles. With granular permissions, you can restrict access to the API server and provide a clear audit trail of actions performed.

The recommended best practice is to use *groups* to provide access to files and folders instead of individual identities. For example, use an Azure AD *group* membership to bind users to Kubernetes roles rather than individual *users*. As a user's group membership changes, their access permissions on the AKS cluster change accordingly. 

Meanwhile, let's say you bind the individual user directly to a role and their job function changes. While the Azure AD group memberships update, their permissions on the AKS cluster would not. In this scenario, the user ends up with more permissions than they require.

For more information about Azure AD integration, Kubernetes RBAC, and Azure RBAC, see [Best practices for authentication and authorization in AKS][aks-best-practices-identity].

## Restrict access to Instance Metadata API

> **Best practice guidance**
>
> Add a network policy in all user namespaces to block pod egress to the metadata endpoint.

> [!NOTE]
> To implement Network Policy, include the attribute `--network-policy azure` when creating the AKS cluster. Use the following command to create the cluster:
> `az aks create -g myResourceGroup -n myManagedCluster --enable-managed-identity --network-plugin azure --network-policy azure`

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: restrict-instance-metadata
spec:
  podSelector:
    matchLabels: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - ipBlock:
        cidr: 10.10.0.0/0#example
        except:
        - 169.254.169.254/32
```

## Secure container access to resources

> **Best practice guidance**
>
> Limit access to actions that containers can perform. Provide the least number of permissions, and avoid the use of root access or privileged escalation.

In the same way that you should grant users or groups the minimum privileges required, you should also limit containers to only necessary actions and processes. To minimize the risk of attack, avoid configuring applications and containers that require escalated privileges or root access. 

For example, set `allowPrivilegeEscalation: false` in the pod manifest. These built-in Kubernetes *pod security contexts* let you define additional permissions, such as the user or group to run as, or the Linux capabilities to expose. For more best practices, see [Secure pod access to resources][pod-security-contexts].

For even more granular control of container actions, you can also use built-in Linux security features such as *AppArmor* and *seccomp*.

1. Define Linux security features at the node level.
1. Implement features through a pod manifest.

Built-in Linux security features are only available on Linux nodes and pods.

> [!NOTE]
> Currently, Kubernetes environments aren't completely safe for hostile multi-tenant usage. Additional security features, like *Microsoft Defender for Containers* *AppArmor*, *seccomp*,*Pod Security Admission*, or Kubernetes RBAC for nodes, efficiently block exploits.
>
>For true security when running hostile multi-tenant workloads, only trust a hypervisor. The security domain for Kubernetes becomes the entire cluster, not an individual node. 
>
> For these types of hostile multi-tenant workloads, you should use physically isolated clusters.

### App Armor

To limit container actions, you can use the [AppArmor][k8s-apparmor] Linux kernel security module. AppArmor is available as part of the underlying AKS node OS, and is enabled by default. You create AppArmor profiles that restrict read, write, or execute actions, or system functions like mounting filesystems. Default AppArmor profiles restrict access to various `/proc` and `/sys` locations, and provide a means to logically isolate containers from the underlying node. AppArmor works for any application that runs on Linux, not just Kubernetes pods.

![AppArmor profiles in use in an AKS cluster to limit container actions](media/operator-best-practices-container-security/apparmor.png)

To see AppArmor in action, the following example creates a profile that prevents writing to files.

1. [SSH][aks-ssh] to an AKS node.
1. Create a file named *deny-write.profile*.
1. Copy and paste the following content:

    ```
    #include <tunables/global>
    profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
      #include <abstractions/base>
  
      file,
      # Deny all file writes.
      deny /** w,
    }
    ```

AppArmor profiles are added using the `apparmor_parser` command.

1. Add the profile to AppArmor.
1. Specify the name of the profile created in the previous step:

    ```console
    sudo apparmor_parser deny-write.profile
    ```

    If the profile is correctly parsed and applied to AppArmor, you won't see any output and you'll be returned to the command prompt.

1. From your local machine, create a pod manifest named *aks-apparmor.yaml*. This manifest:
    * Defines an annotation for `container.apparmor.security.beta.kubernetes`.
    * References the *deny-write* profile created in the previous steps.

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: hello-apparmor
      annotations:
        container.apparmor.security.beta.kubernetes.io/hello: localhost/k8s-apparmor-example-deny-write
    spec:
      containers:
      - name: hello
        image: mcr.microsoft.com/dotnet/runtime-deps:6.0
        command: [ "sh", "-c", "echo 'Hello AppArmor!' && sleep 1h" ]
    ```

2. With the pod deployed, run the following command and verify the *hello-apparmor* pod shows a *Running* status:

    ```
    kubectl get pods

    NAME             READY   STATUS    RESTARTS   AGE
    aks-ssh          1/1     Running   0          4m2s
    hello-apparmor   0/1     Running   0          50s
    ```

For more information about AppArmor, see [AppArmor profiles in Kubernetes][k8s-apparmor].

### Secure computing

While AppArmor works for any Linux application, [seccomp (*sec*ure *comp*uting)][seccomp] works at the process level. Seccomp is also a Linux kernel security module, and is natively supported by the Docker runtime used by AKS nodes. With seccomp, you can limit container process calls. Align to the best practice of granting the container minimal permission only to run by:

* Defining with filters what actions to allow or deny.
* Annotating within a pod YAML manifest to associate with the seccomp filter.

To see seccomp in action, create a filter that prevents changing permissions on a file.

1. [SSH][aks-ssh] to an AKS node.
1. Create a seccomp filter named */var/lib/kubelet/seccomp/prevent-chmod*.
1. Copy and paste the following content:

    ```json
    {
      "defaultAction": "SCMP_ACT_ALLOW",
      "syscalls": [
        {
          "name": "chmod",
          "action": "SCMP_ACT_ERRNO"
        },
        {
          "name": "fchmodat",
          "action": "SCMP_ACT_ERRNO"
        },
        {
          "name": "chmodat",
          "action": "SCMP_ACT_ERRNO"
        }
      ]
    }
    ```

    In version 1.19 and later, you need to configure the following:

    ```json
    {
      "defaultAction": "SCMP_ACT_ALLOW",
      "syscalls": [
        {
          "names": ["chmod","fchmodat","chmodat"],
          "action": "SCMP_ACT_ERRNO"
        }
      ]
    }
    ```

1. From your local machine, create a pod manifest named *aks-seccomp.yaml* and paste the following content. This manifest:

    * Defines an annotation for `seccomp.security.alpha.kubernetes.io`.
    * References the *prevent-chmod* filter created in the previous step.

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: chmod-prevented
      annotations:
        seccomp.security.alpha.kubernetes.io/pod: localhost/prevent-chmod
    spec:
      containers:
      - name: chmod
        image: mcr.microsoft.com/dotnet/runtime-deps:6.0
        command:
          - "chmod"
        args:
         - "777"
         - /etc/hostname
      restartPolicy: Never
    ```

    In version 1.19 and later, you need to configure the following:

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: chmod-prevented
    spec:
      securityContext:
        seccompProfile:
          type: Localhost
          localhostProfile: prevent-chmod
      containers:
      - name: chmod
        image: mcr.microsoft.com/dotnet/runtime-deps:6.0
        command:
          - "chmod"
        args:
         - "777"
         - /etc/hostname
      restartPolicy: Never
    ```

1. Deploy the sample pod using the [kubectl apply][kubectl-apply] command:

    ```console
    kubectl apply -f ./aks-seccomp.yaml
    ```

1. View pod status using the [kubectl get pods][kubectl-get] command.

    * The pod reports an error. 
    * The `chmod` command is prevented from running by the seccomp filter, as shown in the following example output:

    ```
    kubectl get pods

    NAME                      READY     STATUS    RESTARTS   AGE
    chmod-prevented           0/1       Error     0          7s
    ```

For more information about available filters, see [Seccomp security profiles for Docker][seccomp].

## Regularly update to the latest version of Kubernetes

> **Best practice guidance**
>
> To stay current on new features and bug fixes, regularly upgrade the Kubernetes version in your AKS cluster.

Kubernetes releases new features at a quicker pace than more traditional infrastructure platforms. Kubernetes updates include:

* New features
* Bug or security fixes

New features typically move through *alpha* and *beta* status before they become *stable*. Once stable, are generally available and recommended for production use. Kubernetes new feature release cycle allows you to update Kubernetes without regularly encountering breaking changes or adjusting your deployments and templates.

AKS supports three minor versions of Kubernetes. Once a new minor patch version is introduced, the oldest minor version and patch releases supported are retired. Minor Kubernetes updates happen on a periodic basis. To stay within support, ensure you have a governance process to check for necessary upgrades. For more information, see [Supported Kubernetes versions AKS][aks-supported-versions].

### [Azure CLI](#tab/azure-cli)

To check the versions that are available for your cluster, use the [az aks get-upgrades][az-aks-get-upgrades] command as shown in the following example:

```azurecli-interactive
az aks get-upgrades --resource-group myResourceGroup --name myAKSCluster --output table
```

You can then upgrade your AKS cluster using the [az aks upgrade][az-aks-upgrade] command. The upgrade process safely:

* Cordons and drains one node at a time.
* Schedules pods on remaining nodes.
* Deploys a new node running the latest OS and Kubernetes versions.

### [Azure PowerShell](#tab/azure-powershell)

To check the versions that are available for your cluster, use the [Get-AzAksUpgradeProfile][get-azaksupgradeprofile] cmdlet as shown in the following example:

```azurepowershell-interactive
Get-AzAksUpgradeProfile -ResourceGroupName myResourceGroup -ClusterName myAKSCluster |
Select-Object -Property Name, ControlPlaneProfileKubernetesVersion -ExpandProperty ControlPlaneProfileUpgrade |
Format-Table -Property *
```

You can then upgrade your AKS cluster using the [Set-AzAksCluster][set-azakscluster] command. The upgrade process safely:

* Cordons and drains one node at a time.
* Schedules pods on remaining nodes.
* Deploys a new node running the latest OS and Kubernetes versions.

---

>[!IMPORTANT]
> Test new minor versions in a dev test environment and validate that your workload remains healthy with the new Kubernetes version.
>
> Kubernetes may deprecate APIs (like in version 1.16) that your workloads rely on. When bringing new versions into production, consider using [multiple node pools on separate versions](create-node-pools.md) and upgrade individual pools one at a time to progressively roll the update across a cluster. If running multiple clusters, upgrade one cluster at a time to progressively monitor for impact or changes.
>
> ### [Azure CLI](#tab/azure-cli)
>
> ```azurecli-interactive
> az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes-version KUBERNETES_VERSION
> ```
>
> ### [Azure PowerShell](#tab/azure-powershell)
>
> ```azurepowershell-interactive
> Set-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -KubernetesVersion <KUBERNETES_VERSION>
> ```
>
> ---

For more information about upgrades in AKS, see [Supported Kubernetes versions in AKS][aks-supported-versions] and [Upgrade an AKS cluster][aks-upgrade].

## Process Linux node updates

Each evening, Linux nodes in AKS get security patches through their distro update channel. This behavior is automatically configured as the nodes are deployed in an AKS cluster. To minimize disruption and potential impact to running workloads, nodes are not automatically rebooted if a security patch or kernel update requires it. For more information about how to handle node reboots, see [Apply security and kernel updates to nodes in AKS][aks-kured].

### Node image upgrades

Unattended upgrades apply updates to the Linux node OS, but the image used to create nodes for your cluster remains unchanged. If a new Linux node is added to your cluster, the original image is used to create the node. This new node will receive all the security and kernel updates available during the automatic check every night but will remain unpatched until all checks and restarts are complete. You can use node image upgrade to check for and update node images used by your cluster. For more information on node image upgrade, see [Azure Kubernetes Service (AKS) node image upgrade][node-image-upgrade].

## Process Windows Server node updates

For Windows Server nodes, regularly perform a node image upgrade operation to safely cordon and drain pods and deploy updated nodes.

<!-- EXTERNAL LINKS -->
[k8s-apparmor]: https://kubernetes.io/docs/tutorials/clusters/apparmor/
[seccomp]: https://kubernetes.io/docs/concepts/policy/pod-security-policy/#seccomp
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- INTERNAL LINKS -->
[az-aks-get-upgrades]: /cli/azure/aks#az_aks_get_upgrades
[get-azaksupgradeprofile]: /powershell/module/az.aks/get-azaksupgradeprofile
[az-aks-upgrade]: /cli/azure/aks#az_aks_upgrade
[set-azakscluster]: /powershell/module/az.aks/set-azakscluster
[aks-supported-versions]: supported-kubernetes-versions.md
[aks-upgrade]: upgrade-cluster.md
[aks-best-practices-identity]: concepts-identity.md
[aks-kured]: node-updates-kured.md
[aks-aad]: ./azure-ad-integration-cli.md
[best-practices-container-image-management]: operator-best-practices-container-image-management.md
[best-practices-pod-security]: developer-best-practices-pod-security.md
[pod-security-contexts]: developer-best-practices-pod-security.md#secure-pod-access-to-resources
[aks-ssh]: ssh.md
[security-center-aks]: ../defender-for-cloud/defender-for-kubernetes-introduction.md
[node-image-upgrade]: node-image-upgrade.md
[workload-identity-overview]: workload-identity-overview.md
