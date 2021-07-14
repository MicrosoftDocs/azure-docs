---
title: Attestation support with Intel SGX quote helper DaemonSet on Azure (preview)
description: A DaemonSet for generating the quote outside of the Intel SGX application process. This article explains how the out-of-process attestation facility is provided for confidential workloads that run inside a container.
ms.service: container-service
ms.subservice: confidential-computing
author: agowdamsft
ms.topic: overview
ms.date: 2/12/2021
ms.author: amgowda
---

# Platform software management with Intel SGX quote helper DaemonSet (preview)

[Enclave applications](confidential-computing-enclaves.md) that perform remote attestation require a generated quote. This quote provides cryptographic proof of the identity and the state of the application, as well as the environment that the enclave is running. The generation of the quote requires trusted software components that are part of the Intel Platform Software Components (PSW).

## Overview
 
Intel supports two attestation modes to run the quote generation:

- *In-process* hosts the trusted software components inside the enclave application process.

- *Out-of-process* hosts the trusted software components outside of the enclave application.
 
Intel Software Guard Extension (Intel SGX) applications built by using the Open Enclave SDK use the in-process attestation mode, by default. Intel SGX-based applications do allow the out-of-process attestation mode. If you want to use this mode, you need extra hosting, and you need to expose the required components, such as Architectural Enclave Service Manager (AESM), external to the application.

This feature enhances uptime for your enclave apps during Intel platform updates or DCAP driver updates. For this reason, we recommend using it.

To enable this feature on an Azure Kubernetes Services (AKS) cluster, add the `--enable-sgxquotehelper` command to the Azure CLI when you're enabling the confidential computing add-on. 

```azurecli-interactive
# Create a new AKS cluster with system node pool with Confidential Computing addon enabled and SGX Quote Helper
az aks create -g myResourceGroup --name myAKSCluster --generate-ssh-keys --enable-addon confcom --enable-sgxquotehelper
```

For more information, see [Quickstart: Deploy an AKS cluster with confidential computing nodes by using the Azure CLI](confidential-nodes-aks-get-started.md).

## Benefits of the out-of-process mode

The following list describes some of the main benefits of this attestation mode:

-	No updates are required for quote generation components of PSW for each containerized application. Container owners don’t need to manage updates within their container. Container owners instead rely on the provider interface that invokes the centralized service outside of the container. The provider updates and manages the container.

-	You don't need to worry about attestation failures due to out-of-date PSW components. The provider manages the updates to these components.

-	The out-of-process mode provides better utilization of EPC memory than the in-process mode does. In in-process mode, each enclave application needs to instantiate the copy of QE and PCE for remote attestation. In out-of-process mode, there's no need for the container to host those enclaves, and therefore it doesn't consume enclave memory from the container quota.

-	When you upstream the Intel SGX driver into a Linux kernel, there is enforcement for an enclave to have higher privilege. This privilege allows the enclave to invoke PCE, which will break the enclave application running in in-process mode. By default, enclaves don't get this permission. Granting this privilege to an enclave application requires changes to the application installation process. By contrast, in the out-of-process mode, the provider of the service that handles out-of-process requests ensures that the service is installed with this privilege.

-	You don't need to check for backward compatibility with PSW and DCAP. The updates to the quote generation components of PSW are validated for backward compatibility by the provider before updating. This helps you handle compatibility issues before deploying updates for confidential workloads.

## Confidential workloads

The quote requestor and quote generation run separately, but on the same physical machine. Quote generation is centralized, and serves requests for quotes from all entities. For any entity to request quotes, the interface needs to be properly defined and discoverable.

![Diagram showing the relationships among the quote requestor, quote generation, and interface.](./media/confidential-nodes-out-of-proc-attestation/aesmmanager.png)

This abstract model applies to the confidential workload scenario, by taking advantage of the AESM service that's already available. AESM is containerized and deployed as a DaemonSet across the Kubernetes cluster. Kubernetes guarantees a single instance of an AESM service container, wrapped in a pod, to be deployed on each agent node. The new Intel SGX quote DaemonSet will have a dependency on the sgx-device-plugin DaemonSet, because the AESM service container requests EPC memory from the sgx-device-plugin for launching QE and PCE enclaves.

Each container needs to opt in to use out-of-process quote generation by setting the environment variable `SGX_AESM_ADDR=1` during creation. The container should also include the package, libsgx-quote-ex, that's responsible to direct the request to the default Unix domain socket.

An application can still use the in-process attestation as before, but in-process and out-of-process can’t be used simultaneously within an application. The out-of-process infrastructure is available by default, and consumes resources.

## Sample implementation

The following Docker file is a sample for an application based on Open Enclave. Set the `SGX_AESM_ADDR=1` environment variable in the Docker file, or by setting it on the deployment file. The following sample provides details for the Docker file and deployment. 

  > [!Note] 
  > For the out-of-process attestation to work properly, the libsgx-quote-ex from Intel needs to be packaged in the application container.
    
```yaml
# Refer to Intel_SGX_Installation_Guide_Linux for details
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
# This sets the flag for out-of-process attestation mode. Alternatively you can set this flag on the deployment files.
ENV SGX_AESM_ADDR=1 

CMD make run
```
Alternatively, you can set the out-of-process attestation mode in the deployment .yaml file. Here's how:

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

## Next steps

[Quickstart: Deploy an AKS cluster with confidential computing nodes by using the Azure CLI](./confidential-nodes-aks-get-started.md)

[Quick starter samples confidential containers](https://github.com/Azure-Samples/confidential-container-samples)

[DCsv2 SKUs](../virtual-machines/dcv2-series.md)
