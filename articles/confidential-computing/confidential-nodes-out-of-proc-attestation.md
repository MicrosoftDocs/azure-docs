---
 title: Out-of-proc attestation support with Intel SGX quote helper DaemonSet on Azure
 description: DaemonSet for generating the quote outside of the SGX application process. This article explains how the out-of-proc attestation facility is provided for confidential workloads running inside a container.
 ms.service: container-service
 author: agowdamsft
 ms.topic: overview
 ms.date: 9/22/2020
 ms.author: amgowda
---

# Platform Software Management with SGX quote helper daemon set

[Enclave applications](confidential-computing-enclaves.md) that perform remote attestation requires a generated QUOTE. This QUOTE provides cryptographic proof of the identity and the state of the application, as well as the environment the enclave is running. The generation of the QUOTE requires trusted software components that are part of the Intel’s Platform Software Components (PSW).

## Overview
 
Intel supports two attestation modes to run the quote generation:
- **in-proc**: hosts the trusted software components inside the enclave application process

- **out-of-proc**: hosts the trusted software components outside of the enclave application.
 
SGX applications built using Open Enclave SDK by default use in-proc attestation mode. SGX-based applications allow out-of-proc and would require extra hosting and exposing the required components such as Architectural Enclave Service Manager (AESM), external to the application.

Utilizing this feature is **highly recommended**, as it enhances uptime for your enclave apps during Intel Platform updates or DCAP driver updates.

## Why and What are the benefits of out-of-proc?

-	No updates are required for quote generation components of PSW for each containerized application:
With out-of-proc, container owners don’t need to manage updates within their container. Container owners instead rely on the provider provided interface that invokes the centralized service outside of the container, which will be updated and managed by provider.

-	No need to worry about attestation failures due to out-of-date PSW components:
The quote generation involves the trusted SW components - Quoting Enclave (QE) & Provisioning Certificate Enclave (PCE), which are part of the trusted computing base (TCB). These SW components must be up to date to maintain the attestation requirements. Since the provider manages the updates to these components, customers will never have to deal with attestation failures due to out-of-date trusted SW components within their container.

-	Better utilization of EPC memory
In in-proc attestation mode, each enclave application needs to instantiate the copy of QE and PCE for remote attestation. With out-of-proc, there is no need for the container to host those enclaves, and thus doesn’t consume enclave memory from the container quota.

-	Safeguards against Kernel enforcement 
When the SGX driver is up streamed into Linux kernel, there will be enforcement for an enclave to have higher privilege. This privilege allows the enclave to invoke PCE, which will break the enclave application running in in-proc mode. By default, enclaves don't get this permission. Granting this privilege to an enclave application requires changes to the application installation process. This is handled easily for out-of-proc model as the provider of the service that handles out-of-proc requests will make sure the service is installed with this privilege.

-	No need to check for backward compatibility with PSW & DCAP. The updates to the quote generation components of PSW are validated for backward compatibility by the provider before updating. This will help in handling the compatibility issues upfront and address them before deploying updates for confidential workloads.

## How does the out-of-proc attestation mode work for confidential workloads scenario?

The high-level design follows the model where the quote requestor and quote generation are executed separately, but on the same physical machine. The quote generation will be done in a centralized manner and serves requests for QUOTES from all entities. The interface needs to be properly defined and discoverable for any entity to request quotes.

![sgx quote helper aesm](./media/confidential-nodes-out-of-proc-attestation/aesmmanager.png)

The above abstract model applies to confidential workload scenario, by taking advantage of already available AESM service. AESM is containerized and deployed as a daemonSet across the Kubernetes cluster. Kubernetes guarantees a single instance of an AESM service container, wrapped in a Pod, to be deployed on each agent node. The new SGX Quote daemonset will have a dependency on the sgx-device-plugin daemonset, since the AESM service container would request EPC memory from sgx-device-plugin for launching QE and PCE enclaves.

Each container needs to opt in to use out-of-proc quote generation by setting the environment variable **SGX_AESM_ADDR=1** during creation. The container should also include the package libsgx-quote-ex that is responsible to direct the request to default Unix domain socket

An application can still use the in-proc attestation as before, but both in-proc and out-of-proc can’t be used simultaneously within an application. The out-of-proc infrastructure is available by default and consumes resources.

## Sample Implementation

The below docker file is a sample for an Open Enclave-based application. Set the SGX_AESM_ADDR=1 environment variable in the docker file or by set it on the deployment file. Follow the below sample for docker file and deployment yaml details. 

  > [!Note] 
  > The **libsgx-quote-ex** from Intel needs to be packaged in the application container for out-of-proc attestation to work properly.
    
```yaml
# Refer to Intel_SGX_Installation_Guide_Linux for detail
FROM ubuntu:18.04 as sgx_base
RUN apt-get update && apt-get install -y \
    wget \
    gnupg

# Add the repository to sources, and add the key to the list of
# trusted keys used by the apt to authenticate packages
RUN echo "deb [arch=amd64] https://download.01.org/intel-sgx/sgx_repo/ubuntu bionic main" | tee /etc/apt/sources.list.d/intel-sgx.list \
    && wget -qO - https://download.01.org/intel-sgx/sgx_repo/ubuntu/intel-sgx-deb.key | apt-key add -
# Add Microsoft repo for az-dcap-client
RUN echo "deb [arch=amd64] https://packages.microsoft.com/ubuntu/18.04/prod bionic main" | tee /etc/apt/sources.list.d/msprod.list \
    && wget -qO - https://packages.microsoft.com/keys/microsoft.asc | apt-key add -

FROM sgx_base as sgx_sample
RUN apt-get update && apt-get install -y \
    clang-7 \
    libssl-dev \
    gdb \
    libprotobuf10 \
    libsgx-dcap-ql \
    libsgx-quote-ex \
    az-dcap-client \
    open-enclave
WORKDIR /opt/openenclave/share/openenclave/samples/remote_attestation
RUN . /opt/openenclave/share/openenclave/openenclaverc \
    && make build
# this sets the flag for out of proc attestation mode. alternatively you can set this flag on the deployment files
ENV SGX_AESM_ADDR=1 

CMD make run
```
Alternatively, the out-of-proc attestation mode can be set in the deployment yaml file as shown below

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: sgx-test
spec:
  template:
    spec:
      containers:
      - name: sgxtest
        image: <registry>/<repository>:<version>
        env:
        - name: SGX_AESM_ADDR
          value: 1
        resources:
          limits:
            kubernetes.azure.com/sgx_epc_mem_in_MiB: 10
        volumeMounts:
        - name: var-run-aesmd
          mountPath: /var/run/aesmd
      restartPolicy: "Never"
      volumes:
      - name: var-run-aesmd
        hostPath:
          path: /var/run/aesmd
```

## Next Steps
[Provision Confidential Nodes (DCsv2-Series) on AKS](./confidential-nodes-aks-get-started.md)

[Quick starter samples confidential containers](https://github.com/Azure-Samples/confidential-container-samples)

[DCsv2 SKU List](https://docs.microsoft.com/azure/virtual-machines/dcv2-series)

<!-- LINKS - external -->
[Azure Attestation]: https://docs.microsoft.com/en-us/azure/attestation/


<!-- LINKS - internal -->
[DC Virtual Machine]: /confidential-computing/virtual-machine-solutions