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

The Trusted Hardware Identity Management service handles cache management of certificates for all trusted execution environments (TEEs) that reside in Azure. It also provides trusted computing base (TCB) information to enforce a minimum baseline for attestation solutions.

## Trusted Hardware Identity Management and attestation interactions

Trusted Hardware Identity Management defines the Azure security baseline for Azure confidential computing (ACC) nodes and caches collateral from TEE providers. Attestation services and ACC nodes can use the cached information to validate TEEs. The following diagram shows the interactions between an attestation service or node, Trusted Hardware Identity Management, and an enclave host.

:::image type="content" source="./media/thim.png" alt-text="Diagram that illustrates interactions between an attestation service or node, Trusted Hardware Identity Management, and an enclave host.":::

## Frequently asked questions

### How do I use Trusted Hardware Identity Management with Intel processors?

To generate Intel SGX and Intel TDX quotes, the Intel Quote Generation Library (QGL) needs access to quote generation/validation collateral. All or parts of this collateral must be fetched from Trusted Hardware Identity Management. You can fetch it by using the [Intel Quote Provider Library (QPL)](#how-do-i-use-intel-qpl-with-trusted-hardware-identity-management) or the [Azure Data Center Attestation Primitives (DCAP) client library](#what-is-the-azure-dcap-library).

### The "next update" date of the Azure-internal caching service API that Azure Attestation uses seems to be out of date. Is it still in operation and can I use it?

The `tcbinfo` field contains the TCB information. The Trusted Hardware Identity Management service provides older `tcbinfo` information by default. Updating to the latest `tcbinfo` information from Intel would cause attestation failures for customers who haven't migrated to the latest Intel SDK, and it could result in outages.

The Open Enclave SDK and Azure Attestation don't look at the `nextUpdate` date, however, and will pass attestation.

### What is the Azure DCAP library?

The Azure Data Center Attestation Primitives (DCAP) library, a replacement for Intel Quote Provider Library (QPL), fetches quote generation collateral and quote validation collateral directly from the Trusted Hardware Identity Management service. Fetching collateral directly from the Trusted Hardware Identity Management service ensures that all Azure hosts have collateral readily available within the Azure cloud to reduce external dependencies. The current recommended version of the DCAP library is 1.11.2.

### Where can I download the latest DCAP packages?

Use the following links to download the packages:

- [Ubuntu 20.04](https://packages.microsoft.com/ubuntu/20.04/prod/pool/main/a/az-dcap-client/az-dcap-client_1.12.0_amd64.deb)
- [Ubuntu 18.04](https://packages.microsoft.com/ubuntu/18.04/prod/pool/main/a/az-dcap-client/az-dcap-client_1.12.0_amd64.deb)
- [Windows](https://www.nuget.org/packages/Microsoft.Azure.DCAP/1.12.0)

### Why do Trusted Hardware Identity Management and Intel have different baselines?

Trusted Hardware Identity Management and Intel provide different baseline levels of the trusted computing base. When customers assume that Intel has the latest baselines, they must ensure that all the requirements are satisfied. This approach can lead to a breakage if customers haven't updated to the specified requirements.

Trusted Hardware Identity Management takes a slower approach to updating the TCB baseline, so customers can make the necessary changes at their own pace. Although this approach provides an older TCB baseline, customers won't experience a breakage if they haven't met the requirements of the new TCB baseline. This is why the TCB baseline from Trusted Hardware Identity Management is a different version from Intel's baseline. We want to empower customers to meet the requirements of the new TCB baseline at their pace, instead of forcing them to update and causing a disruption that would require reprioritization of workstreams.

### With Coffee Lake, I could get my certificates directly from the Intel PCK. Why, with Ice Lake, do I need to get the certificates from Trusted Hardware Identity Management? And how can I fetch those certificates?

The certificates are fetched and cached in the Trusted Hardware Identity Management service through a platform manifest and indirect registration. As a result, the key caching policy is set to never store root keys for a platform. Expect direct calls to the Intel service from inside the VM to fail.

To retrieve the certificate, you must install the [Azure DCAP library](#what-is-the-azure-dcap-library) that replaces Intel QPL. This library directs the fetch requests to the Trusted Hardware Identity Management service running in the Azure cloud. For download links, see [Where can I download the latest DCAP packages?](#where-can-i-download-the-latest-dcap-packages).

### How do I use Intel QPL with Trusted Hardware Identity Management?

Customers might want the flexibility to use Intel QPL to interact with Trusted Hardware Identity Management without having to download another dependency from Microsoft (that is, the Azure DCAP client library). Customers who want to use Intel QPL with the Trusted Hardware Identity Management service must adjust the Intel QPL configuration file, *sgx_default_qcnl.conf*.

The quote generation/verification collateral that's used to generate the Intel SGX or Intel TDX quotes can be split into:

- The PCK certificate. To retrieve it, customers must use a Trusted Hardware Identity Management endpoint.
- All other quote generation/verification collateral. To retrieve it, customers can either use a Trusted Hardware Identity Management endpoint or an Intel Provisioning Certification Service (PCS) endpoint.

The Intel QPL configuration file (*sgx_default_qcnl.conf*) contains three keys for defining the collateral endpoints. The `pccs_url` key defines the endpoint that's used to retrieve the PCK certificates. The `collateral_service` key can define the endpoint that's used to retrieve all other quote generation/verification collateral. If the `collateral_service` key is not defined, all quote verification collateral is retrieved from the endpoint defined with the `pccs_url` key.

The following table shows how these keys can be set.

| Name | Possible endpoints |
|--|--|
| `pccs_url` | Trusted Hardware Identity Management endpoint: `https://global.acccache.azure.net/sgx/certification/v3`. |
| `collateral_service` | Trusted Hardware Identity Management endpoint (`https://global.acccache.azure.net/sgx/certification/v3`) or Intel PCS endpoint. The [sgx_default_qcnl.conf](https://github.com/intel/SGXDataCenterAttestationPrimitives/blob/master/QuoteGeneration/qcnl/linux/sgx_default_qcnl.conf#L13) file always lists the most up-to-date endpoint in the `collateral_service` key. |

The following code snippet is from an example of an Intel QPL configuration file:

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

The following procedures explain how to change the Intel QPL configuration file and activate the changes.

#### On Windows

1. Make changes to the configuration file.
2. Ensure that there are read permissions to the file from the following registry location and key/value:

   ```bash
   [HKEY_LOCAL_MACHINE\SOFTWARE\Intel\SGX\QCNL]
   "CONFIG_FILE"="<Full File Path>"
   ```

3. Restart the AESMD service. For instance, open PowerShell as an administrator and use the following commands:

   ```bash
   Restart-Service -Name "AESMService" -ErrorAction Stop
   Get-Service -Name "AESMService"
   ```

#### On Linux

1. Make changes to the configuration file. For example, you can use Vim for the changes via the following command:

   ```bash
   sudo vim /etc/sgx_default_qcnl.conf
   ```

2. Restart the AESMD service. Open any terminal and run the following commands:

   ```bash
   sudo systemctl restart aesmd 
   systemctl status aesmd 
   ```

### How do I request collateral in a confidential virtual machine?

Use the following sample in a confidential virtual machine (CVM) guest for requesting AMD collateral that includes the VCEK certificate and certificate chain. For details on this collateral and where it comes from, see [Versioned Chip Endorsement Key (VCEK) Certificate and KDS Interface Specification](https://www.amd.com/system/files/TechDocs/57230.pdf).

#### URI parameters

```bash
GET "http://169.254.169.254/metadata/THIM/amd/certification"
```

#### Request body

| Name | Type | Description |
|--|--|--|
| `Metadata` | Boolean | Setting to `True` allows for collateral to be returned. |

#### Sample request

```bash
curl GET "http://169.254.169.254/metadata/THIM/amd/certification" -H "Metadata: true"
```

#### Responses

| Name | Description |
|--|--|
| `200 OK` | Lists available collateral in the HTTP body within JSON format |
| `Other Status Codes` | Describes why the operation failed |

#### Definitions

| Key | Description |
|--|--|
| `VcekCert` | X.509v3 certificate as defined in RFC 5280 |
| `tcbm` | Trusted computing base |
| `certificateChain` | AMD SEV Key (ASK) and AMD Root Key (ARK) certificates |

### How do I request AMD collateral in an Azure Kubernetes Service Container on a CVM node?

Follow these steps to request AMD collateral in a confidential container:

1. Start by creating an Azure Kubernetes Service (AKS) cluster on a CVM node or by adding a CVM node pool to an existing cluster:
    - Create an AKS cluster on a CVM node:
       1. Create a resource group in one of the CVM supported regions:

          ```bash
          az group create --resource-group <RG_NAME> --location <LOCATION> 
          ```

       2. Create an AKS cluster with one CVM node in the resource group:

          ```bash
          az aks create --name <CLUSTER_NAME> --resource-group <RG_NAME> -l <LOCATION> --node-vm-size Standard_DC4as_v5 --nodepool-name <POOL_NAME> --node-count 1
          ```

       3. Configure kubectl to connect to the cluster:

          ```bash
          az aks get-credentials --resource-group <RG_NAME> --name <CLUSTER_NAME> 
          ```

    - Add a CVM node pool to an existing AKS cluster:

      ```bash
      az aks nodepool add --cluster-name <CLUSTER_NAME> --resource-group <RG_NAME> --name <POOL_NAME > --node-vm-size Standard_DC4as_v5 --node-count 1 
      ```

2. Verify the connection to your cluster by using the `kubectl get` command. This command returns a list of the cluster nodes.

    ```bash
    kubectl get nodes 
    ```

    The following output example shows the single node that you created in the previous steps. Make sure that the node status is `Ready`.

    | NAME | STATUS | ROLES | AGE | VERSION |
    |--|--|--|--|--| 
    | aks-nodepool1-31718369-0 | Ready | agent | 6m44s | v1.12.8 |

3. Create a *curl.yaml* file with the following content. It defines a job that runs a curl container to fetch AMD collateral from the Trusted Hardware Identity Management endpoint. For more information about Kubernetes Jobs, see the [Kubernetes documentation](https://kubernetes.io/docs/concepts/workloads/controllers/job/).

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

    The *curl.yaml* file contains the following arguments.

    | Name | Type | Description |
    |--|--|--|
    | `Metadata` | Boolean | Setting to `True` allows for collateral to be returned. |

4. Run the job by applying the *curl.yaml* file:

    ```bash
    kubectl apply -f curl.yaml 
    ```

5. Check and wait for the pod to complete its job:

    ```bash
    kubectl get pods 
    ```

    Here's an example response:

    | Name | Ready | Status | Restarts | Age |
    |--|--|--|--|--|
    | Curl-w7nt8  | 0/1 | Completed | 0 | 72 s |
  
6. Run the following command to get the job logs and validate if it's working. A successful output should include `vcekCert`, `tcbm`, and `certificateChain`.

    ```bash
    kubectl logs job/curl  
    ```

## Next steps

- Learn more about [Azure Attestation documentation](../../attestation/overview.md).
- Learn more about [Azure confidential computing](https://azure.microsoft.com/blog/introducing-azure-confidential-computing).
