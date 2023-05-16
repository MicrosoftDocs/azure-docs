---
title: Trusted Hardware Identity Management
description: Technical overview of Trusted Hardware Identity Management, which handles cache management of certificates and provides a trusted computing base.
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: mbaldwin
ms.date: 10/24/2022
---

# Trusted Hardware Identity Management

The Trusted Hardware Identity Management (THIM) service handles cache management of certificates for all trusted execution environments (TEE) residing in Azure and provides trusted computing base (TCB) information to enforce a minimum baseline for attestation solutions.

## THIM & attestation interactions

THIM defines the Azure security baseline for Azure Confidential computing (ACC) nodes and caches collateral from TEE providers. The cached information can be further used by attestation services and ACC nodes in validating TEEs. The diagram below shows the interactions between an attestation service or node, THIM, and an enclave host.

:::image type="content" source="./media/thim.png" alt-text="Diagram illustrating the interacts between an attestation service or node, THIM, and an enclave host.":::

## Frequently asked questions

### How do I use THIM with Intel processors?

To generate Intel SGX and Intel TDX quotes, the Intel Quote Generation Library (QGL) needs access to quote generation/verification collateral. All or parts of this collateral must be fetched from THIM. This can be done using the Intel Quote Provider Library (QPL) or Azure DCAP Client Library.
 - To learn more on how to use Intel QPL with THIM, please see: [How do I use the Intel Quote Provider Library (QPL) with THIM?](#how-do-i-use-the-intel-quote-provider-library-qpl-with-thim)
 - To learn more on how to use Azure DCAP with THIM, please see: [Azure DCAP library](#what-is-the-azure-dcap-library)


### The "next update" date of the Azure-internal caching service API, used by Microsoft Azure Attestation, seems to be out of date. Is it still in operation and can it be used?

The "tcbinfo" field contains the TCB information. The THIM service by default provides an older tcbinfo--updating to the latest tcbinfo from Intel would cause attestation failures for those customers who haven't migrated to the latest Intel SDK, and could results in outages.

Open Enclave SDK and Microsoft Azure Attestation don't look at nextUpdate date, however, and will pass attestation. 

### What is the Azure DCAP Library?

Azure Data Center Attestation Primitives (DCAP), a replacement for Intel Quote Provider Library (QPL), fetches quote generation collateral and quote validation collateral directly from the THIM Service. Fetching collateral directly from the THIM service ensures that all Azure hosts have collateral readily available within the Azure cloud to reduce external dependencies. The current recommended version of the DCAP library is 1.11.2.

### Where can I download the latest DCAP packages?

- Ubuntu 20.04: <https://packages.microsoft.com/ubuntu/20.04/prod/pool/main/a/az-dcap-client/az-dcap-client_1.12.0_amd64.deb>
- Ubuntu 18.04: <https://packages.microsoft.com/ubuntu/18.04/prod/pool/main/a/az-dcap-client/az-dcap-client_1.12.0_amd64.deb>
- Windows: <https://www.nuget.org/packages/Microsoft.Azure.DCAP/1.12.0>

### Why are there different baselines between THIM and Intel?

THIM and Intel provide different baseline levels of the trusted computing base. While Intel can be viewed as having the latest and greatest, this imposes requirements upon the consumer to ensure that all the requirements are satisfied, thus leading to a potential breakage of customers if they haven't updated to the specified requirements. THIM takes a slower approach to updating the TCB baseline to allow customers to make the necessary changes at their own pace. This approach, while does provide an older TCB baseline, ensures that customers won't break if they haven't been able to meet the requirements of the new TCB baseline. This reason is why THIM's TCB baseline is of a different version from Intel's. We're customer-focused and want to empower the customer to meet the requirements imposed by the new TCB baseline on their pace, instead of forcing them to update and causing them a disruption that would require reprioritization of their workstreams.

THIM is also introducing a new feature that will enable customers to select their own custom baseline. This feature will allow customers to decide between the newest TCB or using an older TCB than provided by Intel, enabling customers to ensure that the TCB version to enforce is compliant with their specific configuration. This new feature will be reflected in a future iteration of the THIM documentation.

### With Coffeelake I could get my certificates directly from Intel PCK. Why, with Icelake, do I need to get the certificates from THIM, and what do I need to do to fetch those certificates?

The certificates are fetched and cached in THIM service using platform manifest and indirect registration. As a result, Key Caching Policy will be set to never store platform root keys for a given platform. Direct calls to the Intel service from inside the VM are expected to fail.

To retrieve the certificate, you must install the [Azure DCAP library](#what-is-the-azure-dcap-library) that replaces Intel QPL. This library directs the fetch requests to THIM service running in Azure cloud. For the downloading the latest DCAP packages, see: [Where can I download the latest DCAP packages?](#where-can-i-download-the-latest-dcap-packages)

### How do I use the Intel Quote Provider Library (QPL) with THIM? 

Customers may want the flexibility to use the Intel Quote Provider Library (QPL) to interact with THIM without having to download another dependency from Microsoft (i.e., Azure DCAP Client Library). Customers wanting to use Intel QPL with the THIM service must adjust Intel QPL’s configuration file (“sgx_default_qcnl.conf”), which is provided with the Intel QPL. 

The quote generation/verification collateral used to generate the Intel SGX or Intel TDX quotes can be split into the PCK certificate and all other quote generation/verification collateral. The customer has the following options to retrieve the two parts:
 - Retrieve PCK certificate: the customer must use a THIM endpoint.
 - Retrieve other quote generation/verification collateral: the customer can either use a THIM or an Intel Provisioning Certification Service (PCS) endpoint.

The Intel QPL configuration file (“sgx_default_qcnl.conf”) contains three keys used to define the collateral endpoint(s). The “pccs_url” key defines the endpoint used to retrieve the PCK certificates. The “collateral_service” key can be used to define the endpoint used to retrieve all other quote generation/verification collateral. If the “collateral_service” key is not defined, all quote verification collateral will be retrieved from the endpoint defined with the “pccs_url” key.

The following table lists how these keys can be set. 
| Name | Possible Endpoints |
| -- | -- |
| "pccs_url" | THIM endpoint: "https://global.acccache.azure.net/sgx/certification/v3" |
| "collateral_service" | THIM endpoint: "https://global.acccache.azure.net/sgx/certification/v3" or Intel PCS endpoint: The following file will always list the most up-to-date endpoint in the “collateral_service” key: [sgx_default_qcnl.conf](https://github.com/intel/SGXDataCenterAttestationPrimitives/blob/master/QuoteGeneration/qcnl/linux/sgx_default_qcnl.conf#L13) |

The following is a code snipped from an Intel QPL configuration file example: 

```bash
    { 
        "pccs_url": "https://global.acccache.azure.net/sgx/certification/v3/", 
        "use_secure_cert": true, 
        "collateral_service": "https://global.acccache.azure.net/sgx/certification/v3/",  
        "pccs_api_version": "3.1", 
        "retry_times": 6, 
        "retry_delay": 5, 
        "local_pck_url": "http://169.254.169.254/metadata/THIM/sgx/certification/v3/",
        "pck_cache_expire_hours": 24, 
        "verify_collateral_cache_expire_hours": 24, 
        "custom_request_options": { 
            "get_cert": { 
                "headers": { 
                    "metadata": "true" 
                }, 
                "params": { 
                    "api-version  ": "2021-07-22-preview" 
                } 
            } 
        } 
    }   
```
    
In the following, we explain how the Intel QPL configuration file can be changed and how the changes can be activated.

#### On Windows
 1. Make desired changes to the configuration file.
 2. Ensure that there are read permissions to the file from the following registry location and key/value.
 ```bash
 [HKEY_LOCAL_MACHINE\SOFTWARE\Intel\SGX\QCNL]
 "CONFIG_FILE"="<Full File Path>"
 ```
 3.	Restart AESMD service. For instance, open PowerShell as an administrator and use the following commands:
 ```bash
 Restart-Service -Name "AESMService" -ErrorAction Stop
 Get-Service -Name "AESMService"
 ```

#### On Linux
 1. Make desired changes to the configuration file. For example, vim can be used for the changes using the following command:
 ```bash
 sudo vim /etc/sgx_default_qcnl.conf
 ```
 2. Restart AESMD service. Open any terminal and execute the following commands:
 ```bash
 sudo systemctl restart aesmd 
 systemctl status aesmd 
 ```

### How do I request collateral in a Confidential Virtual Machine (CVM)?

Use the following sample in a CVM guest for requesting AMD collateral that includes the VCEK certificate and certificate chain. For details on this collateral and where it originates from, see [Versioned Chip Endorsement Key (VCEK) Certificate and KDS Interface Specification](https://www.amd.com/system/files/TechDocs/57230.pdf).

#### URI parameters

```bash
GET "http://169.254.169.254/metadata/THIM/amd/certification"
```

#### Request body

| Name | Type | Description |
|--|--|--|
| Metadata | Boolean | Setting to True allows for collateral to be returned |

#### Sample request

```bash
curl GET "http://169.254.169.254/metadata/THIM/amd/certification" -H "Metadata: true”
```

#### Responses

| Name | Description |
|--|--|
| 200 OK | Lists available collateral in http body within JSON format. For details on the keys in the JSON, see Definitions |
| Other Status Codes | Error response describing why the operation failed |

#### Definitions

| Key | Description |
|--|--|
| VcekCert | X.509v3 certificate as defined in RFC 5280. |
| tcbm | Trusted Computing Base |
| certificateChain | Includes the AMD SEV Key (ASK) and AMD Root Key (ARK) certificates |

### How do I request AMD collateral in an Azure Kubernetes Service (AKS) Container on a Confidential Virtual Machine (CVM) node?

Follow the steps for requesting AMD collateral in a confidential container. 
1. Start by creating an AKS cluster on CVM mode or adding a CVM node pool to the existing cluster.
    1. Create an AKS Cluster on CVM node.
       1. Create a resource group in one of the CVM supported regions.
         ```bash
         az group create --resource-group <RG_NAME> --location <LOCATION> 
         ```
       2. Create an AKS cluster with one CVM node in the resource group. 
         ```bash
         az aks create --name <CLUSTER_NAME> --resource-group <RG_NAME> -l <LOCATION> --node-vm-size Standard_DC4as_v5 --nodepool-name <POOL_NAME> --node-count 1
         ```
       3. Configure kubectl to connect to the cluster. 
         ```bash
         az aks get-credentials --resource-group <RG_NAME> --name <CLUSTER_NAME> 
         ```
    2. Add a CVM node pool to the existing AKS cluster.
      ```bash
      az aks nodepool add --cluster-name <CLUSTER_NAME> --resource-group <RG_NAME> --name <POOL_NAME > --node-vm-size Standard_DC4as_v5 --node-count 1 
      ```
    3. Verify the connection to your cluster using the kubectl get command. This command returns a list of the cluster nodes.
      ```bash
      kubectl get nodes 
      ```
    The following output example shows the single node created in the previous steps. Make sure the node status is Ready: 
    
    | NAME | STATUS | ROLES | AGE | VERSION | 
    |--|--|--|--|--| 
    | aks-nodepool1-31718369-0 | Ready | agent | 6m44s | v1.12.8 | 

2. Once the AKS cluster is created, create a curl.yaml file with the following content. It defines a job that runs a curl container to fetch AMD collateral from the THIM endpoint. For more information about Kubernetes Jobs, please see [Kubernetes documentation](https://kubernetes.io/docs/concepts/workloads/controllers/job/). 

    **curl.yaml**
    ```bash
    apiVersion: batch/v1 
    kind: Job 
    metadata: 
      name: curl 
    spec: 
      template: 
        metadata: 
          labels: 
            app: curl 
        spec: 
          nodeSelector: 
            kubernetes.azure.com/security-type: ConfidentialVM 
          containers: 
            - name: curlcontainer 
              image: alpine/curl:3.14 
              imagePullPolicy: IfNotPresent 
              args: ["-H", "Metadata:true", "http://169.254.169.254/metadata/THIM/amd/certification"] 
          restartPolicy: "Never" 
    ```
    
    **Arguments**
    
    | Name | Type | Description |
    |--|--|--|
    | Metadata | Boolean | Setting to True to allow for collateral to be returned |
    
3. Run the job by applying the curl.yaml.
    ```bash
    kubectl apply -f curl.yaml 
    ```
4. Check and wait for the pod to complete its job.
    ```bash
    kubectl get pods 
    ```
    
    **Example Response**
    
    | Name | Ready | Status | Restarts | Age |
    |--|--|--|--|--|
    | Curl-w7nt8  | 0/1 | Completed | 0 | 72 s |
    
5. Run the following command to get the job logs and validate if it is working. A successful output should include vcekCert, tcbm and certificateChain.
    ```bash
    kubectl logs job/curl  
    ``` 

## Next steps

- Learn more about [Azure Attestation documentation](../../attestation/overview.md)
- Learn more about [Azure Confidential Computing](https://azure.microsoft.com/blog/introducing-azure-confidential-computing)
