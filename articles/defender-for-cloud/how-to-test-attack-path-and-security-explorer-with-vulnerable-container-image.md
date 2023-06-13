---
title: How to test the attack path and security explorer using a vulnerable container image 
description: Learn how to view and remediate vulnerability assessment findings for registry images 
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 06/13/2023
---

# How to test the attack path and security explorer using a vulnerable container image 

## Observing potential Attack Paths in the Attack Path experience

Attack path analysis is a graph-based algorithm that scans the cloud security graph. The scans expose exploitable paths that attackers may use to breach your environment.

1.	Go to “Microsoft Defender for Cloud” = > “Recommendations” 
2.	Click on the “Attack Path” link to open the Attack Paths view.
3.	A listing of attack paths is displayed.
1.	Sort your attack paths based on name, environment, paths count, risk categories.
2.	Investigate an attack path by clicking on it and browsing the information bar and the map of involved resources.
3.	Investigate further by clicking on a node in the map. Clicking the “insights” tab leads to a summary of security insights on the resource. 
The following insight types are shown:
-	Pod Exposed to the   internet 
-	Privileged container 
-	Pod uses host network 

-	Container image is vulnerable to remote code execution

If there are no entries in the list of attack path, it is still possible to test this feature using the following steps. 

**Requirement:** An instance of Azure Container Registry (ACR) in the tested scope

1.	Import a mock vulnerable image to your Azure Container Registry:

    1.	Run in Cloud Shell: 

        ```az acr import --name $MYACR --source DCSPMtesting.azurecr.io/mdc-mock-0001 --image mdc-mock-0001```
    1. if your AKS is not attached to your ACR)
-	Use the following cloud shell command line to point your AKS instance to pull images from the selected ACR:
        ```az aks update -n myAKSCluster -g myResourceGroup --attach-acr <acr-name>```

1. Allow work on a cluster:
    
    1. Run the command: ```az aks get-credentials  --subscription <cluster-suid> --resource-group <your-rg> --name <your-cluster-name>```
    
1. Verify success by doing the following:

   - Look for an entry with **mdc-dcspm-demo** as namespace
   - In Workloads-> Deployments tab verify “pod” created 3/3 and **dcspmcharts-ingress-nginx-controller** 1/1.
   - In services and ingresses look for-> services **service**, **dcspmcharts-ingress-nginx-controller and dcspmcharts-ingress-nginx-controller-admission**. In the ingress tab you should verify one **ingress** is created with an ip address and nginx class.

1. Deploy the mock vulnerable image and exposing the vulnerable container to the internet:

    1. RUn the command: ```helm install dcspmcharts oci://dcspmtesting.azurecr.io/dcspmcharts --version 1.0.0  --namespace mdc-dcspm-demo --create-namespace --set registry=<your-registry>```

    > [!NOTE]
    > The system’s architecture is based on a snapshot mechanism with an interval of every 6 hours, which is typically the time to observe inventory. For insights and attack paths it can take up to 24 hours. 

1. Query the security explorer for containers images that are vulnerable.
1. Find this security issue under attack paths:

    1.	Go to “Microsoft Defender for Cloud” = > “Recommendations” 
    1.	Click on the **Attack Path** link to open the Attack Paths view
    1.	Locate the entry that details this security issue under “Internet exposed Kubernetes pod is running a container with high severity vulnerabilities”. Depending on the way you have connected the container to internet, the issue can be instead found under “Try triggering an additional attack path: an AKS pod with host network access is running a container with a vulnerability that can be exploited remotely." 

    > [!NOTE]
    > After completing the above flow, it can take up to 24 hours to see results in the Security Explorer and Attack Path.


## Next Steps 
- Learn how to [configure Azure COntainer Registry integration for existing AKS clusters](https://learn.microsoft.com/azure/aks/cluster-container-registry-integration?tabs=azure-cli#configure-acr-integration-for-existing-aks-clusters)
 - Learn more about the Defender for Cloud [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads).
