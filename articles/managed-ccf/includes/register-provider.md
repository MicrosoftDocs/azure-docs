---
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: include
ms.date: 09/13/2023
ms.author: msmbaldwin

# Prerequites include for quickstarts and how to guides for registering the Microsoft.ConfidentialLedger provider.

---

The Azure Managed CCF resource type must be registered in the subscription before creating a resource. 

```azurecli
az feature registration create --namespace Microsoft.ConfidentialLedger --name ManagedCCF

az provider register --namespace Microsoft.ConfidentialLedger
```