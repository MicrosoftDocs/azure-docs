---
title: Operator best practices - Container security in Azure Kubernetes Services (AKS)
description: Learn the cluster operator best practices for how to secure containers in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 11/26/2018
ms.author: iainfou
---

# Best practices for container security in Azure Kubernetes Service (AKS)

As you develop and run applications in Azure Kubernetes Service (AKS), the security of your containers is a key consideration. Containers that include out-of-date base images or application runtime introduce a security risk and possible attack vector. To minimize these risks, you should integrate tools that scan for and remediate issues in your containers, and limit access that containers have to the underlying AKS nodes.

This article focuses on how to secure your containers in AKS. You learn how to:

> [!div class="checklist"]
> * Scan for and remediate image vulnerabilities
> * Use a trusted registry with digitally signed container images
> * Automatically trigger and redeploy container images when a base image is updated
> * Limit access to node resources from within a container using AppArmour or Seccomp

You can also read the best practices for [cluster security][best-practices-cluster-security] and for [pod security][best-practices-pod-security].

## Secure the images and run time

**Best practice guidance** - Scan your container images for vulnerabilities, and only deploy images that have passed validation. Regularly update the base images and application runtime, then redeploy workloads in the AKS cluster.

One concern with the adoption of container-based workloads is verifying the security of images and runtime used to build your own applications. How do you make sure that you don't introduce security vulnerabilities into your deployments? Your deployment workflow should include a process to scan container images using tools such as [Twistlock][twistlock] or [Aqua][aqua], and then only allow verified images to be deployed. In a real-world example, you can use a continuous integration and continuous deployment (CI/CD) pipeline to automate the image scans, verification, and deployments. Azure Container Registry includes these vulnerabilities scanning capabilities.

![Scan and remediate container images, validate, and deploy](media/operator-best-practices-container-security/scan-container-images-simplified.png)

### Use a trusted registry

For additional security, you can also digitally sign your container images. You then only permit deployments of signed images. This process provides an additional layer of security in that limit to only images digitally signed and trusted by you, not just images that pass a vulnerability check.

Trusted registries that provide digitally signed container images add complexity to your environment, but may be required for certain policy or regulatory compliance. Azure Container Registry supports the use of trusted registries and signed images.

For more information about digitally signed images, see [Content trust in Azure Container Registry][acr-content-trust].

### Automatically build new images on base image update

Each time a base image is updated, any downstream container images should also be updated. This build process should be integrated into validation and deployment pipelines such as [Azure Pipelines][azure-pipelines] to make sure that your applications continue to run on the updated based images. Once your application container images are validated, the AKS deployments can then be updated to run the latest, secure images.

Azure Container Registry Tasks can also automatically update container images when the base image is updated. This feature allows you to build a small number of base images, and regularly keep them updated with bug and security fixes.

For more information about base image updates, see [Automate image builds on base image update with Azure Container Registry Tasks][acr-base-image-update].

## Secure container access to resources

**Best practice guidance** - Limit access to actions that containers can perform. Provide the least number of permissions, and avoid the use of root / privileged escalation.

In the same way that you should grant users or groups the least number of privileges required, containers should also be limited to only the actions and processes that they need. To minimize the risk of attack, don't configure applications and containers that require escalated privileges or root access. For example, set `allowPrivilegeEscalation: false` in the pod manifest. These *pod security contexts* are built-in to Kubernetes and let you define additional permissions such as the user or group to run as, or what Linux capabilities to expose. For more best practices, see [Secure pod access to resources][pod-security-contexts].

For more granular control of container actions, you can also use built-in Linux security features such as *AppArmor* and *seccomp*. These features are defined at the node level, and then implemented through a pod manifest.

### App Armor

To limit the actions that containers can perform, you can use the [AppAmour][k8s-apparmor] Linux kernel security module. AppArmor is available as part of the underlying AKS node OS, and is enabled by default. You create AppArmor profiles that restrict actions such as read, write, or execute, or system functions such as mounting filesystems. Default AppArmor profiles restrict access to various `/proc` and `/sys` locations, and provide a means to logically isolate containers from the underlying node. AppArmor works for any application that runs on Linux, not just Kubernetes pods.

![AppArmor profiles in use in an AKS cluster to limit container actions](media/operator-best-practices-container-security/apparmor.png)

To see AppArmor in action, the following example creates a profile that prevents writing to files. [SSH][aks-ssh] to an AKS node, then create a file named *deny-write.profile* and paste the following content:

```
#include <tunables/global>
profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>
  
  file,
  # Deny all file writes.
  deny /** w,
}
```

AppArmor profiles are added using the `apparmor_parser` command. Add the profile to AppArmor and specify the name of the profile created in the previous step:

```console
sudo apparmor_parser deny-write.profile
```

There is no output returned if the profile is correctly parsed and applied to AppArmor. You are returned to the command prompt.

From your local machine, now create a pod manifest named *aks-apparmor.yaml* and paste the following content. This manifest defines an annotation for `container.apparmor.security.beta.kubernetes` add references the *deny-write* profile created in the previous steps:

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
    image: busybox
    command: [ "sh", "-c", "echo 'Hello AppArmor!' && sleep 1h" ]
```

Deploy the sample pod using the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f aks-apparmor.yaml
```

With the pod deployed, use the [kubectl exec][kubectl-exec] command to write to a file. The command cannot be executed, as shown in the following example output:

```
$ kubectl exec hello-apparmor touch /tmp/test

touch: /tmp/test: Permission denied
command terminated with exit code 1
```

For more information about AppArmor, see [AppArmor profiles in Kubernetes][k8s-apparmor].

### Secure computing

While AppArmor works for any Linux application, [seccomp (*sec*ure *comp*uting)][seccomp] works at the process level. Seccomp is also a Linux kernel security module, and is natively supported by the Docker runtime used by AKS nodes. With seccomp, the process calls that containers can perform are limited. You create filters that define what actions are allowed or denied, and then use annotations within a pod YAML manifest to associate with the seccomp filter.

To see seccomp in action, create a filter that prevents changing permissions on a file. [SSH][aks-ssh] to an AKS node, then create a seccomp filter named */var/lib/kubelet/seccomp/prevent-chmod* and paste the following content:

```
{
  "defaultAction": "SCMP_ACT_ALLOW",
  "syscalls": [
    {
      "name": "chmod",
      "action": "SCMP_ACT_ERRNO"
    }
  ]
}
```

From your local machine, now create a pod manifest named *aks-seccomp.yaml* and paste the following content. This manifest defines an annotation for `seccomp.security.alpha.kubernetes.io` and references the *prevent-chmod* filter created in the previous step:

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
    image: busybox
    command:
      - "chmod"
    args:
     - "777"
     - /etc/hostname
  restartPolicy: Never
```

Deploy the sample pod using the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f ./aks-seccomp.yaml
```

View the status of the pods using the [kubectl get pods][kubectl-get] command. The pod reports an error. The `chmod` command is prevented from running by the seccomp filter, as shown in the following example output:

```
$ kubectl get pods

NAME                      READY     STATUS    RESTARTS   AGE
chmod-prevented           0/1       Error     0          7s
```

For more information about available filters, see [Seccomp security profiles for Docker][seccomp].

## Next steps

This article focused on how to secure your containers. To implement some of these areas, see the following articles:

* [Automate image builds on base image update with Azure Container Registry Tasks][acr-base-image-update]
* [Content trust in Azure Container Registry][acr-content-trust]

<!-- EXTERNAL LINKS -->
[azure-pipelines]: /azure/devops/pipelines/?view=vsts
[twistlock]: https://www.twistlock.com/
[aqua]: https://www.aquasec.com/
[k8s-apparmor]: https://kubernetes.io/docs/tutorials/clusters/apparmor/
[seccomp]: https://docs.docker.com/engine/security/seccomp/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- INTERNAL LINKS -->
[best-practices-cluster-security]: operator-best-practices-cluster-security.md
[best-practices-pod-security]: developer-best-practices-pod-security.md
[acr-content-trust]: ../container-registry/container-registry-content-trust.md
[acr-base-image-update]: ../container-registry/container-registry-tutorial-base-image-update.md
[aks-ssh]: ssh.md
[pod-security-contexts]: developer-best-practices-pod-security.md#secure-pod-access-to-resources
