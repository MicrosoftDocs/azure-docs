---
title: How-to test the attack path and cloud security explorer using a vulnerable container image in Microsoft Defender for Cloud
description: Learn how to test the attack path and security explorer using a vulnerable container image
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 11/08/2023
---

# Testing the Attack Path and Security Explorer using a vulnerable container image

## Observing potential threats in the attack path experience

Attack path analysis is a graph-based algorithm that scans the cloud security graph. The scans expose exploitable paths that attackers might use to breach your environment to reach your high-impact assets. Attack path analysis exposes attack paths and suggests recommendations as to how best remediate issues that break the attack path and prevent successful breach.

Explore and investigate [attack paths](how-to-manage-attack-path.md) by sorting them based on risk level, name, environment, and risk factors, entry point, target, affected resources and active recommendations. Explore cloud security graph Insights on the resource. Examples of Insight types are:

-	Pod exposed to the internet 
-	Privileged container 
-	Pod uses host network 
-	Container image is vulnerable to remote code execution

## Testing the attack path and security explorer using a mock vulnerable container image

If there are no entries in the list of attack paths, you can still test this feature by using a mock container image. Use the following steps to set up the test: 

**Requirement:** An instance of Azure Container Registry (ACR) in the tested scope.

1.	Import a mock vulnerable image to your Azure Container Registry:

    1.	Run the following command in Cloud Shell: 

        ```
        az acr import --name $MYACR --source DCSPMtesting.azurecr.io/mdc-mock-0001 --image mdc-mock-0001
        ```

    1.  If you don't have an AKS cluster, use the following command to create a new AKS cluster:

        ```
        az aks create -n myAKSCluster -g myResourceGroup --generate-ssh-keys --attach-acr $MYACR
        ```

    1.  If your AKS isn't attached to your ACR, use the following Cloud Shell command line to point your AKS instance to pull images from the selected ACR:

        ```
        az aks update -n myAKSCluster -g myResourceGroup --attach-acr <acr-name>

1. Authenticate your Cloud Shell session to work with the cluster:
    
    ```
    az aks get-credentials  --subscription <cluster-suid> --resource-group <your-rg> --name <your-cluster-name>
    
1. Verify success by doing the following steps:

   - Look for an entry with **mdc-dcspm-demo** as namespace
   - In the **Workloads-> Deployments** tab, verify “pod” created 3/3 and **dcspmcharts-ingress-nginx-controller** 1/1.
   - In services and ingresses look for-> services **service**, **dcspmcharts-ingress-nginx-controller and dcspmcharts-ingress-nginx-controller-admission**. In the ingress tab, verify one **ingress** is created with an IP address and nginx class.

1. Deploy the mock vulnerable image to expose the vulnerable container to the internet by running the following command:

 ```
 helm install dcspmcharts oci://dcspmtesting.azurecr.io/dcspmcharts --version 1.0.0  --namespace mdc-dcspm-demo --create-namespace --set registry=<your-registry>
```

> [!NOTE]
> After completing the above flow, it can take up to 24 hours to see results in the cloud security explorer and attack path.

## Investigate internet exposed Kubernetes pods

You can build queries in one of the following ways:

- [Find the security issue under attack paths](#find-the-security-issue-under-attack-paths)
- [Explore risks with built-in cloud security explorer templates](#explore-risks-with-cloud-security-explorer-templates)
- [Create custom queries with cloud security explorer](#create-custom-queries-with-cloud-security-explorer)

### Find the security issue under attack paths

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Attack path analysis**.

1. Select an attack path.

1.	Locate the entry that details this security issue under `Internet exposed Kubernetes pod is running a container with high severity vulnerabilities`.

###  Explore risks with cloud security explorer templates

1. From the Defender for Cloud overview page, open the cloud security explorer.

1. Some out of the box templates for Kubernetes appear. Select one of the templates:

    - **Azure Kubernetes pods running images with high severity vulnerabilities**
     - **Kubernetes namespaces contain vulnerable pods**
  
    :::image type="content" source="media/how-to-test-attack-path/select-template.png" alt-text="Screenshot showing where to select templates." lightbox="media/how-to-test-attack-path/select-template.png"::: 

1. Select **Open query**; the template builds the query in the upper portion of the screen. Select **Search** to view the results.
    
    :::image type="content" source="media/how-to-test-attack-path/query-builder-search.png" alt-text="Screenshot that shows the query built and where to select search." lightbox="media/how-to-test-attack-path/query-builder-search.png":::

### Create custom queries with cloud security explorer

You can also create your own custom queries. The following example shows a search for pods running container images that are vulnerable to remote code execution.

:::image type="content" source="media/how-to-test-attack-path/custom-query-search.png" alt-text="Screenshot that shows a custom query." lightbox="media/how-to-test-attack-path/custom-query-search.png":::

The results are listed below the query.

:::image type="content" source="media/how-to-test-attack-path/custom-query-results.png" alt-text="Screenshot that shows the results from a custom query." lightbox="media/how-to-test-attack-path/custom-query-results.png":::

## Next steps 

 - Learn more about the Defender for Cloud [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads).
