---
title: How-to test the attack path and security explorer using a vulnerable container image 
description: Learn how to test the attack path and security explorer using a vulnerable container image
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 06/25/2023
---

# Testing the Attack Path and Security Explorer using a vulnerable container image

## Observing potential Attack Paths in the Attack Path experience

Attack path analysis is a graph-based algorithm that scans the cloud security graph. The scans expose exploitable paths that attackers may use to breach your environment to reach your high-impact assets. Attack path analysis exposes attack paths and suggests recommendations as to how best remediate issues that will break the attack path and prevent successful breach.

Explore and investigate [attack paths](how-to-manage-attack-path.md) by sorting them based on name, environment, path count, and risk categories. Explore cloud security graph Insights on the resource. Examples of Insight types are:

-	Pod exposed to the internet 
-	Privileged container 
-	Pod uses host network 
-	Container image is vulnerable to remote code execution

## Testing the Attack Path and Security Explorer using a mock vulnerable container image

If there are no entries in the list of attack paths, you can still test this feature by using a mock container image. Use the following steps to setup the test: 

**Requirement:** An instance of Azure Container Registry (ACR) in the tested scope.

1.	Import a mock vulnerable image to your Azure Container Registry:

    1.	Run the following command in Cloud Shell: 

        ```
        ```az acr import --name $MYACR --source DCSPMtesting.azurecr.io/mdc-mock-0001 --image mdc-mock-0001```
    
    1. If your AKS isn't attached to your ACR, use the following Cloud Shell command line to point your AKS instance to pull images from the selected ACR:

        ```
        ```az aks update -n myAKSCluster -g myResourceGroup --attach-acr <acr-name>````

1. Allow work on a cluster:
    
    ```
    ```az aks get-credentials  --subscription <cluster-suid> --resource-group <your-rg> --name <your-cluster-name>```
    
1. Verify success by doing the following steps:

   - Look for an entry with **mdc-dcspm-demo** as namespace
   - In the **Workloads-> Deployments** tab, verify “pod” created 3/3 and **dcspmcharts-ingress-nginx-controller** 1/1.
   - In services and ingresses look for-> services **service**, **dcspmcharts-ingress-nginx-controller and dcspmcharts-ingress-nginx-controller-admission**. In the ingress tab, verify one **ingress** is created with an IP address and nginx class.

1. Deploy the mock vulnerable image to expose the vulnerable container to the internet by running the following command:

 ```
 ```helm install dcspmcharts oci://dcspmtesting.azurecr.io/dcspmcharts --version 1.0.0  --namespace mdc-dcspm-demo --create-namespace --set registry=<your-registry>```

    > [!NOTE]
    > After completing the above flow, it can take up to 24 hours to see results in the Security Explorer and Attack Path.

1. Query the Cloud Security Explorer for containers images that are vulnerable.

    :::image type="content" source="media/how-to-test-attack-path/query-images-with-vulnerabilities.png" alt-text="Screenshot of building a query in Cloud Security Explorer." lightbox="media/concept-cloud-map/cloud-security-explorer-main-page.png":::

1. Find this security issue under attack paths:

    1.	Go to **Recommendations** in the Defender for Cloud menu.
    1.	Select on the **Attack Path** link to open the Attack Paths view.

        :::image type="content" source="media/how-to-test-attack-path/attack-path.png" alt-text="Screenshot of showing where to select Attack Path." lightbox="media/concept-cloud-map/attack-path.png":::

    1.	Locate the entry that details this security issue under “Internet exposed Kubernetes pod is running a container with high severity vulnerabilities”.

        :::image type="content" source="media/how-to-test-attack-path/attack-path-kubernetes-pods-vulnerabilities.png" alt-text="Screenshot showing the security issue details." lightbox="media/concept-cloud-map/attack-path-kubernetes-pods-vulnerabilities.png"::: 

 Depending on the way you connected the container to the internet, the issue can be alternatively be found under “Try triggering another attack path: an AKS pod with host network access is running a container with a vulnerability that can be exploited remotely." 

## Next Steps 

 - Learn more about the Defender for Cloud [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads).
