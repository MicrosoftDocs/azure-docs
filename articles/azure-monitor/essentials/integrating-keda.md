

Prerequisites

1. AKS cluster
1. Managed prometheus sending metrics to an Azure Monitor workspace


> [!NOTE]
> KEDA addon (preview) for AKS does not currently support managed prometheus.

Overview o integrations steps
Set ip Pod Identity or Workload Identity for AKS
Install KEDA
Configure sacler


To integrate KEDA with Azure Monitor, you need to Deploy and configure workload identity on your AKS cluster. This allows KEDA to authenticate with you Azure Monitor workspace and retrieve metrics for scaling.


export RESOURCE_GROUP="rg-ed-kedatest-01"
export LOCATION="eastus"
export SERVICE_ACCOUNT_NAMESPACE="default"
export SERVICE_ACCOUNT_NAME="workload-identity-sa"
export SUBSCRIPTION="$(az account show --query id --output tsv)"
export USER_ASSIGNED_IDENTITY_NAME="myIdentity"
export FEDERATED_IDENTITY_CREDENTIAL_NAME="myFedIdentity" 
