---
title: Restrict egress traffic in an Azure Red Hat OpenShift (ARO) cluster
description: Learn what ports and addresses are required to control egress traffic in Azure Red Hat OpenShift (ARO)
author: sakthi-vetrivel
ms.author: jzim
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 04/09/2021
---
# Control egress traffic for your Azure Red Hat OpenShift (ARO) cluster (preview)

This article provides the necessary details that allow you to secure outbound traffic from your Azure Red Hat OpenShift cluster (ARO). It contains the cluster requirements for a basic ARO deployment, and more requirements for optional Red Hat and third-party components. An [example](#private-aro-cluster-setup) will be provided at the end on how to configure these requirements with Azure Firewall. Keep in mind, you can apply this information to Azure Firewall or to any outbound restriction method or appliance.

## Before you begin

This article assumes that you're creating a new cluster. If you need a basic ARO cluster, see the [ARO quickstart](./tutorial-create-cluster.md).

> [!IMPORTANT]
> ARO preview features are available on a self-service, opt-in basis. Previews are provided "as is" and "as available," and they're excluded from the service-level agreements and limited warranty. ARO previews are partially covered by customer support on a best-effort basis.

## Minimum Required FQDN / application rules

This list is based on the list of FQDNs found in the OpenShift docs here: https://docs.openshift.com/container-platform/4.6/installing/install_config/configuring-firewall.html

The following FQDN / application rules are required:

| Destination FQDN | Port | Use |
| ----------- | ----------- | ------------- |
| **`*.quay.io`** | **HTTPS:443** | Mandatory for the installation, used by the cluster. This is used by the cluster to download the platform container images. |
| **`registry.redhat.io`** | **HTTPS:443** | Mandatory for core add-ons. This is used by the cluster to download core components such as dev tools, operator-based add-ons, and Red Hat provided container images.
| **`mirror.openshift.com`** | **HTTPS:443** | This is required in the VDI environment or your laptop to access mirrored installation content and images. It's required in the cluster to download platform release signatures to know what images to pull from quay.io. |
| **`api.openshift.com`** | **HTTPS:443** | Required  by the cluster to check if there are available updates before downloading the image signatures. |
| **`arosvc.azurecr.io`** | **HTTPS:443** | Internal Private registry for ARO Operators.  Required if you do not allow the service-endpoints Microsoft.ContainerRegistry on your subnets. |
| **`management.azure.com`** | **HTTPS:443** | This is used by the cluster to access Azure APIs. |
| **`login.microsoftonline.com`** | **HTTPS:443** | This is used by the cluster for authentication to Azure. |
| **`gcs.prod.monitoring.core.windows.net`** | **HTTPS:443** | This is used for Microsoft Geneva Monitoring so that the ARO team can monitor the customer's cluster(s). |
| **`*.blob.core.windows.net`** | **HTTPS:443** | This is used for Microsoft Geneva Monitoring so that the ARO team can monitor the customer's cluster(s). |
| **`*.servicebus.windows.net`** | **HTTPS:443** | This is used for Microsoft Geneva Monitoring so that the ARO team can monitor the customer's cluster(s). |
| **`*.table.core.windows.net`** | **HTTPS:443** | This is used for Microsoft Geneva Monitoring so that the ARO team can monitor the customer's cluster(s). |

> [!NOTE] 
> For many customers exposing *.blob, *.table and other large address spaces creates a potential data exfiltration concern. You may want to consider using the [OpenShift Egress Firewall](https://docs.openshift.com/container-platform/4.6/networking/openshift_sdn/configuring-egress-firewall.html) to protect applications deployed in the cluster from reaching these destinations and use Azure Private Link for specific application needs.

---

## Complete list of required and optional FQDNs

### FIRST GROUP: INSTALLING AND DOWNLOADING PACKAGES AND TOOLS

- **`quay.io`**: Mandatory for the installation, used by the cluster. This is used by the cluster to download the platform container images.
- **`registry.redhat.io`**: Mandatory for core add-ons. This is used by the cluster to download core components such as dev tools, operator-based add-ons, or Red Hat provided container images such as our middleware, the Universal Base Image...
- **`sso.redhat.com`**: This one is required in the VDI environment or your laptop to connect to cloud.redhat.com. This is the site where we can download the pull secret, and use some of the SaaS solutions we offer in Red Hat to facilitate monitoring of your subscriptions, cluster inventory, chargeback reporting, among other things.
- **`openshift.org`**: This one is required in the VDI environment or your laptop to connect to download RH CoreOS images, but in Azure they are picked from the marketplace, there is no need to download OS images.

---

### SECOND GROUP: TELEMETRY

All this section can be opted out, but before we know how, please check what it is: https://docs.openshift.com/container-platform/4.6/support/remote_health_monitoring/about-remote-health-monitoring.html
- **`cert-api.access.redhat.com`**: Use in your VDI or laptop environment.
- **`api.access.redhat.com`**: Use in your VDI or laptop environment.
- **`infogw.api.openshift.com`**: Use in your VDI or laptop environment.
- **`https://cloud.redhat.com/api/ingress`**: Use in the cluster for the insights operator who integrates with the aaS Red Hat Insights.
In OpenShift Container Platform, customers can opt out of reporting health and usage information. However, connected clusters allow Red Hat to react more quickly to problems and better support our customers, and better understand how product upgrades clusters. Check details here: https://docs.openshift.com/container-platform/4.6/support/remote_health_monitoring/opting-out-of-remote-health-reporting.html.

---

### THIRD GROUP: CLOUD APIs

- **`management.azure.com`**: This is used by the cluster to access Azure APIs.

---

### FOURTH GROUP: OTHER OPENSHIFT REQUIREMENTS

- **`mirror.openshift.com`**: This one is required in the VDI environment or your laptop to access mirrored installation content and images and required in the cluster to download platform release signatures, used by the cluster to know what images to pull from quay.io.
- **`storage.googleapis.com/openshift-release`**: Alternative site to download platform release signatures, used by the cluster to know what images to pull from quay.io.
- **`*.apps.<cluster_name>.<base_domain>`** (OR EQUIVALENT ARO URL): When allowlisting domains, this is use in your corporate network to reach applications deployed in OpenShift, or to access the OpenShift console.
- **`api.openshift.com`**: Required  by the cluster to check if there are available updates before downloading the image signatures.
- **`registry.access.redhat.com`**: Registry access is required in your VDI or laptop environment to download dev images when using the ODO CLI tool. (This CLI tool is an alternative CLI tool for developers who aren't familiar with kubernetes). https://docs.openshift.com/container-platform/4.6/cli_reference/developer_cli_odo/understanding-odo.html

---

### FIFTH GROUP: MICROSOFT & RED HAT ARO MONITORING SERVICE

- **`login.microsoftonline.com`**: This is used by the cluster for authentication to Azure.
- **`gcs.prod.monitoring.core.windows.net`**: This is used for Microsoft Geneva Monitoring so that the ARO team can monitor the customer's cluster(s).
- **`*.blob.core.windows.net`**: This is used for Microsoft Geneva Monitoring so that the ARO team can monitor the customer's cluster(s).
- **`*.servicebus.windows.net`**: This is used for Microsoft Geneva Monitoring so that the ARO team can monitor the customer's cluster(s).
- **`*.table.core.windows.net`**: This is used for Microsoft Geneva Monitoring so that the ARO team can monitor the customer's cluster(s).

## ARO integrations

### Azure Monitor for containers

There are two options to provide access to Azure Monitor for containers, you may allow the Azure Monitor [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) **or** provide access to the required FQDN/Application Rules.  Here are the [instructions](../azure-monitor/containers/container-insights-azure-redhat4-setup.md) on how to add Azure Monitor to your existing ARO cluster.

#### Required network rules

The following FQDN / application rules are required:

| Destination Endpoint                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
| [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureMonitor:443`**  | TCP           | 443      | This endpoint is used to send metrics data and logs to Azure Monitor and Log Analytics. |

#### Required FQDN / application rules

The following FQDN / application rules are required for ARO clusters that have the Azure Monitor for containers enabled:

| FQDN                                    | Port      | Use      |
|-----------------------------------------|-----------|----------|
| **`dc.services.visualstudio.com`** | **`HTTPS:443`**    | This endpoint is used for metrics and monitoring telemetry using Azure Monitor. |
| **`*.ods.opinsights.azure.com`**    | **`HTTPS:443`**    | This endpoint is used by Azure Monitor for ingesting log analytics data. |
| **`*.oms.opinsights.azure.com`** | **`HTTPS:443`** | This endpoint is used by omsagent, which is used to authenticate the log analytics service. |
| **`*.monitoring.azure.com`** | **`HTTPS:443`** | This endpoint is used to send metrics data to Azure Monitor. |


## Private ARO cluster setup
The goal is to secure ARO cluster by routing Egress traffic through an Azure Firewall
### Before:
![Before](media/concepts-networking/aro-private.jpg)
### After:
![After](media/concepts-networking/aro-fw.jpg)

## Create a private ARO cluster

### Set up VARS for your environment
```bash

CLUSTER=aro-cluster # Name of your created cluster
RESOURCEGROUP=aro-rg # The name of your resource group where you created the ARO cluster
AROVNET=aro-vnet # The name of your vnet from your created ARO cluster
JUMPSUBNET=jump-subnet
LOCATION=eastus # The location where ARO cluster is deployed

```

### Create a resource group
```bash
az group create -g "$RESOURCEGROUP" -l $LOCATION
```

### Create the virtual network
```bash
az network vnet create \
  -g $RESOURCEGROUP \
  -n $AROVNET \
  --address-prefixes 10.0.0.0/8
```

### Add two empty subnets to your virtual network
```bash
  az network vnet subnet create \
    -g "$RESOURCEGROUP" \
    --vnet-name $AROVNET \
    -n "$CLUSTER-master" \
    --address-prefixes 10.10.1.0/24 \
    --service-endpoints Microsoft.ContainerRegistry

  az network vnet subnet create \
    -g $RESOURCEGROUP \
    --vnet-name $AROVNET \
    -n "$CLUSTER-worker" \
    --address-prefixes 10.20.1.0/24 \
    --service-endpoints Microsoft.ContainerRegistry
```

### Disable network policies for Private Link Service on your virtual network and subnets. This is a requirement for the ARO service to access and manage the cluster.
```bash
az network vnet subnet update \
  -g "$RESOURCEGROUP" \
  --vnet-name $AROVNET \
  -n "$CLUSTER-master" \
  --disable-private-link-service-network-policies true
```
### Create a Firewall Subnet
```bash
az network vnet subnet create \
    -g "$RESOURCEGROUP" \
    --vnet-name $AROVNET \
    -n "AzureFirewallSubnet" \
    --address-prefixes 10.100.1.0/26
```

## Create a jump-host VM
### Create a jump-subnet
```bash
  az network vnet subnet create \
    -g "$RESOURCEGROUP" \
    --vnet-name $AROVNET \
    -n $JUMPSUBNET \
    --address-prefixes 10.30.1.0/24 \
    --service-endpoints Microsoft.ContainerRegistry
```
### Create a jump-host VM
```bash
VMUSERNAME=aroadmin

az vm create --name ubuntu-jump \
             --resource-group $RESOURCEGROUP \
             --ssh-key-values ~/.ssh/id_rsa.pub \
             --admin-username $VMUSERNAME \
             --image UbuntuLTS \
             --subnet $JUMPSUBNET \
             --public-ip-address jumphost-ip \
             --vnet-name $AROVNET 
```

## Create an Azure Red Hat OpenShift cluster
### Get a Red Hat pull secret (optional)

A Red Hat pull secret enables your cluster to access Red Hat container registries along with other content. This step is optional but recommended.

1. **[Go to your Red Hat OpenShift cluster manager portal](https://cloud.redhat.com/openshift/install/azure/aro-provisioned) and log in.**

   You will need to log in to your Red Hat account or create a new Red Hat account with your business email and accept the terms and conditions.

2. **Click Download pull secret.**

Keep the saved `pull-secret.txt` file somewhere safe - it will be used in each cluster creation.

When running the `az aro create` command, you can reference your pull secret using the `--pull-secret @pull-secret.txt` parameter. Execute `az aro create` from the directory where you stored your `pull-secret.txt` file. Otherwise, replace `@pull-secret.txt` with `@<path-to-my-pull-secret-file`.

If you are copying your pull secret or referencing it in other scripts, your pull secret should be formatted as a valid JSON string.

```bash
az aro create \
  -g "$RESOURCEGROUP" \
  -n "$CLUSTER" \
  --vnet $AROVNET \
  --master-subnet "$CLUSTER-master" \
  --worker-subnet "$CLUSTER-worker" \
  --apiserver-visibility Private \
  --ingress-visibility Private \
  --pull-secret @pull-secret.txt
```

## Create an Azure Firewall

### Create a public IP Address
```bash
az network public-ip create -g $RESOURCEGROUP -n fw-ip --sku "Standard" --location $LOCATION
```
### Update install Azure Firewall extension
```bash
az extension add -n azure-firewall
az extension update -n azure-firewall
```

### Create Azure Firewall and configure IP Config
```bash
az network firewall create -g $RESOURCEGROUP -n aro-private -l $LOCATION
az network firewall ip-config create -g $RESOURCEGROUP -f aro-private -n fw-config --public-ip-address fw-ip --vnet-name $AROVNET

```

### Capture Azure Firewall IPs for a later use
```bash
FWPUBLIC_IP=$(az network public-ip show -g $RESOURCEGROUP -n fw-ip --query "ipAddress" -o tsv)
FWPRIVATE_IP=$(az network firewall show -g $RESOURCEGROUP -n aro-private --query "ipConfigurations[0].privateIpAddress" -o tsv)

echo $FWPUBLIC_IP
echo $FWPRIVATE_IP
```

### Create a UDR and Routing Table for Azure Firewall
```bash
az network route-table create -g $RESOURCEGROUP --name aro-udr

az network route-table route create -g $RESOURCEGROUP --name aro-udr --route-table-name aro-udr --address-prefix 0.0.0.0/0 --next-hop-type VirtualAppliance --next-hop-ip-address $FWPRIVATE_IP
```

### Add Application Rules for Azure Firewall
Rule for OpenShift to work based on this [list](https://docs.openshift.com/container-platform/4.3/installing/install_config/configuring-firewall.html#configuring-firewall_configuring-firewall):
```bash
az network firewall application-rule create -g $RESOURCEGROUP -f aro-private \
 --collection-name 'ARO' \
 --action allow \
 --priority 100 \
 -n 'required' \
 --source-addresses '*' \
 --protocols 'http=80' 'https=443' \
 --target-fqdns 'registry.redhat.io' '*.quay.io' 'sso.redhat.com' 'management.azure.com' 'mirror.openshift.com' 'api.openshift.com' 'quay.io' '*.blob.core.windows.net' 'gcs.prod.monitoring.core.windows.net' 'registry.access.redhat.com' 'login.microsoftonline.com' '*.servicebus.windows.net' '*.table.core.windows.net' 'grafana.com'
```
Optional rules for Docker images:
```bash
az network firewall application-rule create -g $RESOURCEGROUP -f aro-private \
 --collection-name 'Docker' \
 --action allow \
 --priority 200 \
 -n 'docker' \
 --source-addresses '*' \
 --protocols 'http=80' 'https=443' \
 --target-fqdns '*cloudflare.docker.com' '*registry-1.docker.io' 'apt.dockerproject.org' 'auth.docker.io'
```

### Associate ARO Subnets to FW
```bash
az network vnet subnet update -g $RESOURCEGROUP --vnet-name $AROVNET --name "$CLUSTER-master" --route-table aro-udr
az network vnet subnet update -g $RESOURCEGROUP --vnet-name $AROVNET --name "$CLUSTER-worker" --route-table aro-udr
```

## Test the configuration from the Jumpbox
These steps work only if you added rules for Docker images. 
### Configure the jumpbox
Log into a jumpbox VM and install `azure-cli`, `oc-cli`, and `jq` utils. For the installation of openshift-cli, check the Red Hat customer portal.
```bash
#Install Azure-cli
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
#Install jq
sudo apt install jq -y
```
### Log into the ARO cluster
List cluster credentials:
```bash

# Login to Azure
az login
# Set Vars in Jumpbox
CLUSTER=aro-cluster # Name of your created cluster
RESOURCEGROUP=aro-rg # The name of your resource group where you created the ARO cluster

#Get the cluster credentials
ARO_PASSWORD=$(az aro list-credentials -n $CLUSTER -g $RESOURCEGROUP -o json | jq -r '.kubeadminPassword')
ARO_USERNAME=$(az aro list-credentials -n $CLUSTER -g $RESOURCEGROUP -o json | jq -r '.kubeadminUsername')
```
Get an API server endpoint:
```bash
ARO_URL=$(az aro show -n $CLUSTER -g $RESOURCEGROUP -o json | jq -r '.apiserverProfile.url')
```

### Download the oc CLI to the jumpbox
```bash
cd ~
wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-client-linux.tar.gz

mkdir openshift
tar -zxvf openshift-client-linux.tar.gz -C openshift
echo 'export PATH=$PATH:~/openshift' >> ~/.bashrc && source ~/.bashrc
```

Log in using `oc login`:
```bash
oc login $ARO_URL -u $ARO_USERNAME -p $ARO_PASSWORD
```

### Run CentOS to test outside connectivity
Create a pod
```bash
cat <<EOF | oc apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: centos
spec:
  containers:
  - name: centos
    image: centos
    ports:
    - containerPort: 80
    command:
    - sleep
    - "3600"
EOF
```
Once the pod is running, exec into it and test outside connectivity.

```bash
oc exec -it centos -- /bin/bash
curl microsoft.com
```

## Access the web console of the private cluster

### Set up ssh forwards commands

```bash
sudo ssh -i $SSH_PATH -L 443:$CONSOLE_URL:443 aroadmin@$JUMPHOST

example:
sudo ssh -i /Users/jimzim/.ssh/id_rsa -L 443:console-openshift-console.apps.d5xm5iut.eastus.aroapp.io:443 aroadmin@104.211.18.56
```

### Modify the etc. hosts file on your local machine
```bash
##
# Host Database
#
127.0.0.1 console-openshift-console.apps.d5xm5iut.eastus.aroapp.io
127.0.0.1 oauth-openshift.apps.d5xm5iut.eastus.aroapp.io
```

### Use sshuttle as another option

[SSHuttle](https://github.com/sshuttle/sshuttle)


## Clean up resources

```bash

# Clean up the ARO cluster, vnet, firewall and jumpbox

# Remove udr from master and worker subnets first or will get error when deleting ARO cluster
az network vnet subnet update --vnet-name $AROVNET -n aro-cluster-master -g $RESOURCEGROUP --route-table aro-udr --remove routeTable
az network vnet subnet update --vnet-name $AROVNET -n aro-cluster-worker -g $RESOURCEGROUP --route-table aro-udr --remove routeTable

# Remove ARO Cluster
az aro delete -n $CLUSTER -g $RESOURCEGROUP

# Remove the resource group that contains the firewall, jumpbox and vnet
az group delete -n $RESOURCEGROUP
```
