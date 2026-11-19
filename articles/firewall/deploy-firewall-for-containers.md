---
title: Deploy Azure Firewall for Containers (preview)
description: Learn how to deploy the Azure Firewall Controller on AKS, configure Kubernetes security policies, and route application egress through Azure Firewall.
author: asudbring
ms.author: allensu
ms.service: azure-firewall
ms.topic: how-to
ms.date: 11/10/2026
ms.custom: references_regions
# Customer intent: As a Kubernetes administrator, I want to manage Azure Firewall protection through Kubernetes resources so that I can configure egress policies for AKS workloads.
---

# Deploy Azure Firewall for Containers (preview)

Azure Firewall for Containers lets you manage Azure Firewall protection for Azure Kubernetes Service (AKS) workloads through Kubernetes custom resources. The Azure Firewall Controller translates these resources into Azure Firewall configuration and policies.

In this article, you create an AKS cluster or use an existing cluster, install the controller, create a firewall, and configure protection for selected pods' outbound traffic.

> [!TIP]
> To create a new AKS cluster and Azure Firewall with an Azure Resource Manager (ARM) template, use the [ARM template quickstart](quick-create-containers-template.md).

> [!IMPORTANT]
> Azure Firewall for Containers is currently in public preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Understand the configuration model

The controller uses three custom resource definitions (CRDs):

| Resource | Purpose |
| --- | --- |
| `AzureFirewall` | Creates and manages an Azure Firewall deployment. |
| `SecurityPolicy` | Defines advanced firewall settings, network rules, application rules, or a combination of these settings. |
| `SecurityPolicyAttachment` | References security policies, identifies the firewall, and lists the AKS workload subnets. The controller combines the referenced policies into a child Azure Firewall Policy. |

A `SecurityPolicy` doesn't apply to traffic until a `SecurityPolicyAttachment` references it. Application traffic must also traverse the firewall.

The controller supports pod and namespace selectors for rule collections. Advanced settings include intrusion detection and prevention (IDPS), DNS, threat intelligence, and source network address translation (SNAT). Feature availability also depends on the firewall SKU and its configuration.

## Prerequisites

- An Azure subscription and access to Azure Firewall for Containers in a supported preview region.
- An AKS cluster that uses Azure CNI in your own virtual network, or permissions to create one. Azure CNI Overlay isn't supported. This walkthrough uses a cluster and virtual network in the same resource group.
- An outbound connectivity path for the cluster while you install the controller and prepare the firewall. Before changing routing, plan the cluster's [outbound type](/azure/aks/egress-outboundtype) and [required outbound connectivity](/azure/aks/outbound-rules-control-egress).
- Pod traffic must reach the firewall with the pod IP as its source, not masqueraded to the node IP. On the first policy attachment, the controller creates `kube-system/azure-ip-masq-agent-config` to turn off pod SNAT. If you already have custom `ip-masq-agent` configuration, make sure it doesn't masquerade this egress traffic.
- If you use an existing firewall or supply your own base policy, allow the required AKS outbound traffic and HTTPS on port 443 to `*.afc.azure.com`. The controller-created base policy already supplies these rules.
- Permission to administer the cluster, install CRDs, and create the Azure networking resources in this walkthrough.
- Permission to create a user-assigned managed identity and assign its required role. Creating role assignments requires an appropriate role, such as Role Based Access Control Administrator, at the assignment scope.
- The [Azure CLI](/cli/azure/install-azure-cli), [kubectl](/azure/aks/learn/quick-kubernetes-deploy-cli), and [Helm](https://helm.sh/docs/intro/install/).
- A Bash environment, such as Azure Cloud Shell in Bash mode.

> [!IMPORTANT]
> Azure CNI Overlay isn't supported. The cluster must use Azure CNI with pod IPs from the virtual network (`networkPlugin` is `azure` and `networkPluginMode` isn't set).

> [!WARNING]
> Changing an AKS subnet's route table or cluster outbound type can interrupt cluster and application connectivity. Use an isolated evaluation environment first. Record the existing configuration and prepare a rollback plan before changing egress.

The preview supports Azure public cloud in the following regions. Use a region enabled for your preview subscription.

| Region | Azure CLI value |
| --- | --- |
| Central US EUAP | `centraluseuap` |
| East US 2 EUAP | `eastus2euap` |
| West Central US | `westcentralus` |
| East Asia | `eastasia` |
| UK South | `uksouth` |
| Central US | `centralus` |

## Set up the environment

Replace the two placeholder values. The other names are examples; change them as needed, and for an existing cluster, use your existing resource names. Keep the controller version as shown. Use Bash for all commands in this article.

```bash
# Required: replace these placeholders.
SUBSCRIPTION_ID='<subscription-id>'
LOCATION='<preview-region>'

# Example names: change as needed. For an existing cluster, use your existing resource names.
RESOURCE_GROUP='afc-rg'
VNET_NAME='afc-vnet'
VNET_CIDR='10.224.0.0/12'
AKS_SUBNET_NAME='aks-subnet'
AKS_SUBNET_CIDR='10.224.0.0/16'
AKS_NAME='aks-cluster'
VM_SIZE='Standard_DS3_v2'        # must be available in your region
IDENTITY_RESOURCE_NAME='azure-firewall-identity'
HELM_NAMESPACE='firewall-namespace'

# Fixed value: the supported Azure Firewall Controller version for this preview. Use it as shown.
CONTROLLER_VERSION='20261109.1'

az login
az account set --subscription "$SUBSCRIPTION_ID"

```

The examples use controller chart version `20261109.1`. Choose a virtual machine size available in your selected region.

Register the resource providers:

```azurecli
az provider register --namespace Microsoft.ContainerService --wait
az provider register --namespace Microsoft.Network --wait
```

## Prepare the AKS cluster

Choose the existing-cluster or new-cluster path.

### Use an existing cluster

Check its network configuration:

```azurecli
az aks show \
  --resource-group "$RESOURCE_GROUP" \
  --name "$AKS_NAME" \
  --query 'networkProfile.{plugin:networkPlugin, mode:networkPluginMode}' -o json
```

The network plugin must be `azure`, and its mode must be `null`, not `overlay`. Retrieve the cluster's region:

```bash
LOCATION=$(az aks show \
  --resource-group "$RESOURCE_GROUP" \
  --name "$AKS_NAME" \
  --query location -o tsv)
```

### Create a new cluster

For a new evaluation environment, create the resource group, virtual network, and AKS subnet:

```bash
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

az network vnet create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VNET_NAME" \
  --location "$LOCATION" \
  --address-prefixes "$VNET_CIDR"

az network vnet subnet create \
  --resource-group "$RESOURCE_GROUP" \
  --vnet-name "$VNET_NAME" \
  --name "$AKS_SUBNET_NAME" \
  --address-prefixes "$AKS_SUBNET_CIDR" \
  --default-outbound-access false

AKS_SUBNET_ID=$(az network vnet subnet show \
  --resource-group "$RESOURCE_GROUP" \
  --vnet-name "$VNET_NAME" \
  --name "$AKS_SUBNET_NAME" \
  --query id -o tsv)

az aks create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$AKS_NAME" \
  --location "$LOCATION" \
  --node-vm-size "$VM_SIZE" \
  --vnet-subnet-id "$AKS_SUBNET_ID" \
  --network-plugin azure \
  --enable-oidc-issuer \
  --enable-workload-identity \
  --generate-ssh-keys
```

This path keeps cluster bootstrap connectivity available before you create the firewall route. It doesn't select `userDefinedRouting` before that route exists.

### Record the network configuration

For either path, retrieve the AKS subnet ID and record the route table, outbound type, and DNS servers before changing them:

```bash
AKS_SUBNET_ID=$(az network vnet subnet show \
  --resource-group "$RESOURCE_GROUP" \
  --vnet-name "$VNET_NAME" \
  --name "$AKS_SUBNET_NAME" \
  --query id -o tsv)

ORIGINAL_ROUTE_TABLE_ID=$(az network vnet subnet show \
  --resource-group "$RESOURCE_GROUP" \
  --vnet-name "$VNET_NAME" \
  --name "$AKS_SUBNET_NAME" \
  --query routeTable.id -o tsv)
echo "$ORIGINAL_ROUTE_TABLE_ID"

az aks show \
  --resource-group "$RESOURCE_GROUP" \
  --name "$AKS_NAME" \
  --query networkProfile.outboundType -o tsv

az network vnet show \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VNET_NAME" \
  --query dhcpOptions.dnsServers -o json
```

If a route table is already associated with the subnet, preserve its required routes. Don't replace a shared route table with the example table without assessing the effect on other workloads.

## Configure workload identity

For an existing cluster, enable the OpenID Connect (OIDC) issuer and workload identity. The new-cluster command already enables them. Wait for the update to complete before retrieving the issuer URL.

```azurecli
az aks update \
  --resource-group "$RESOURCE_GROUP" \
  --name "$AKS_NAME" \
  --enable-oidc-issuer \
  --enable-workload-identity
```

Create a dedicated user-assigned managed identity for the controller:

```bash
az identity create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$IDENTITY_RESOURCE_NAME"

IDENTITY_PRINCIPAL_ID=$(az identity show \
  --resource-group "$RESOURCE_GROUP" \
  --name "$IDENTITY_RESOURCE_NAME" \
  --query principalId -o tsv)

IDENTITY_CLIENT_ID=$(az identity show \
  --resource-group "$RESOURCE_GROUP" \
  --name "$IDENTITY_RESOURCE_NAME" \
  --query clientId -o tsv)

RESOURCE_GROUP_ID=$(az group show \
  --name "$RESOURCE_GROUP" \
  --query id -o tsv)

ROLE_ASSIGNMENT_ID=$(az role assignment create \
  --assignee-object-id "$IDENTITY_PRINCIPAL_ID" \
  --assignee-principal-type ServicePrincipal \
  --role 'Network Contributor' \
  --scope "$RESOURCE_GROUP_ID" \
  --query id -o tsv)
```

The controller uses this identity to manage firewalls and Firewall Policies. If these resources are in a different resource group, grant the identity the required Network Contributor access at that resource group's scope too. Allow time for identity and role-assignment changes to propagate before diagnosing an authorization failure.

Create the federated credential:

```bash
AKS_OIDC_ISSUER=$(az aks show \
  --resource-group "$RESOURCE_GROUP" \
  --name "$AKS_NAME" \
  --query oidcIssuerProfile.issuerUrl -o tsv)

az identity federated-credential create \
  --resource-group "$RESOURCE_GROUP" \
  --identity-name "$IDENTITY_RESOURCE_NAME" \
  --name "$IDENTITY_RESOURCE_NAME" \
  --issuer "$AKS_OIDC_ISSUER" \
  --subject "system:serviceaccount:${HELM_NAMESPACE}:azurefirewall-controller-sa" \
  --audience api://AzureADTokenExchange
```

The namespace in the federated subject must match the namespace that you use when installing the Helm chart. The chart creates the `azurefirewall-controller-sa` service account.

## Install the Azure Firewall Controller

Connect kubectl to the cluster and install the controller:

```bash
az aks get-credentials \
  --resource-group "$RESOURCE_GROUP" \
  --name "$AKS_NAME"

helm install azfw-controller \
  oci://mcr.microsoft.com/firewall/charts/azurefirewall-controller \
  --namespace "$HELM_NAMESPACE" \
  --version "$CONTROLLER_VERSION" \
  --set "azfwController.podIdentity.clientID=$IDENTITY_CLIENT_ID" \
  --create-namespace

kubectl get pods --namespace "$HELM_NAMESPACE"
```

Check that the controller pods are running and their containers are ready before proceeding.

For an existing Helm release, use `helm upgrade` instead of `helm install`:

```bash
helm upgrade azfw-controller \
  oci://mcr.microsoft.com/firewall/charts/azurefirewall-controller \
  --namespace "$HELM_NAMESPACE" \
  --version "$CONTROLLER_VERSION" \
  --set "azfwController.podIdentity.clientID=$IDENTITY_CLIENT_ID"
```

## Prepare the firewall resources

The firewall resource uses a firewall subnet, a management subnet, one data-plane public IP resource, and a management public IP resource. Skip creation for suitable resources that already exist.

The subnet names must be `AzureFirewallSubnet` and `AzureFirewallManagementSubnet`. Choose address ranges within your existing virtual network that don't overlap the AKS subnet or other subnets. The following example ranges require a virtual network address space that contains them:

```bash
FW_SUBNET_NAME='AzureFirewallSubnet'
MGMT_SUBNET_NAME='AzureFirewallManagementSubnet'
FW_SUBNET_CIDR='10.225.0.0/26'
MGMT_SUBNET_CIDR='10.225.1.0/26'
FW_IP='fw-ip'
FW_MGMT_IP='fw-mgmt-ip'

az network vnet subnet create \
  --resource-group "$RESOURCE_GROUP" \
  --vnet-name "$VNET_NAME" \
  --name "$FW_SUBNET_NAME" \
  --address-prefixes "$FW_SUBNET_CIDR" \
  --default-outbound-access false

az network vnet subnet create \
  --resource-group "$RESOURCE_GROUP" \
  --vnet-name "$VNET_NAME" \
  --name "$MGMT_SUBNET_NAME" \
  --address-prefixes "$MGMT_SUBNET_CIDR" \
  --default-outbound-access false

az network public-ip create \
  --resource-group "$RESOURCE_GROUP" --name "$FW_IP" \
  --location "$LOCATION" --sku Standard \
  --allocation-method Static --version IPv4

az network public-ip create \
  --resource-group "$RESOURCE_GROUP" --name "$FW_MGMT_IP" \
  --location "$LOCATION" --sku Standard \
  --allocation-method Static --version IPv4
```

Retrieve the resource IDs. The custom resource requires Azure resource IDs, not public IP address values.

```bash
FW_SUBNET_ID=$(az network vnet subnet show \
  --resource-group "$RESOURCE_GROUP" --vnet-name "$VNET_NAME" \
  --name "$FW_SUBNET_NAME" --query id -o tsv)

MGMT_SUBNET_ID=$(az network vnet subnet show \
  --resource-group "$RESOURCE_GROUP" --vnet-name "$VNET_NAME" \
  --name "$MGMT_SUBNET_NAME" --query id -o tsv)

FW_IP_ID=$(az network public-ip show \
  --resource-group "$RESOURCE_GROUP" --name "$FW_IP" --query id -o tsv)

FW_MGMT_IP_ID=$(az network public-ip show \
  --resource-group "$RESOURCE_GROUP" --name "$FW_MGMT_IP" --query id -o tsv)
```

## Create the firewall

Create `firewall.yaml`. The unquoted heredoc expands the resource-ID variables.

```bash
cat > firewall.yaml <<EOF
apiVersion: firewall.networking.azure.io/v1alpha1
kind: AzureFirewall
metadata:
  name: example-firewall
  namespace: default
spec:
  data:
    subnetId: ${FW_SUBNET_ID}
    ipAddresses:
      - ${FW_IP_ID}
  management:
    subnetId: ${MGMT_SUBNET_ID}
    ipAddress: ${FW_MGMT_IP_ID}
EOF

kubectl apply -f firewall.yaml
kubectl wait --for=jsonpath='{.status.conditions[?(@.type=="Deployment")].reason}'=Ready \
  azurefirewall/example-firewall --namespace default --timeout=30m
kubectl get azurefirewall example-firewall --namespace default -o yaml
```

You can optionally add `spec.firewallPolicyReference` with the resource ID of an existing Firewall Policy. Without a reference, the controller creates a managed policy.

Creation can take 10-15 minutes. Wait for the `Deployment` condition's **reason** to become `Ready`. Waiting only for the condition's status can return while Azure deployment is still in progress. Inspect other returned conditions and resolve reported errors before continuing.

Read the deployed firewall's private IP address from its status:

```bash
FW_PRIVATE_IP=$(kubectl get azurefirewall example-firewall --namespace default \
  -o jsonpath='{.status.firewallResourceInfo.privateIPAddress}')
echo "$FW_PRIVATE_IP"
```

To use an existing firewall instead, skip creating the `AzureFirewall` resource and use its Azure resource ID in the attachment described later in this article. The existing firewall must use a Firewall Policy, not classic rules.

For that path, set `FW_PRIVATE_IP` to the existing firewall's private IP address before you configure routing:

```bash
FW_PRIVATE_IP='<existing-firewall-private-ip>'
```

## Configure a security policy

The following policy selects pods with the label `role: developer` and permits HTTPS requests to the Microsoft and Google subdomains used in the test. This policy doesn't replace AKS infrastructure rules.

Create `security-policy.yaml`:

```yaml
apiVersion: firewall.networking.azure.io/v1alpha1
kind: SecurityPolicy
metadata:
  name: example-securitypolicy-rules
  namespace: default
spec:
  applicationRuleCollections:
    - name: test-application-rules
      refs:
        - podSelector:
            matchLabels:
              role: developer
      action: Allow
      egress:
        - name: allow-test-destinations
          toPortProtocol:
            - protocolType: HTTPS
              port: 443
          to:
            - fqdn:
                - "*.microsoft.com"
                - "*.google.com"
```

Apply the policy:

```bash
kubectl apply -f security-policy.yaml
```

### Network and application rule options

Each collection uses `refs` to select pods, namespaces, or both, and an `action` of `Allow` or `Deny`.

| Collection | Configuration options |
| --- | --- |
| `networkRuleCollections` | TCP, UDP, ICMP, or ANY; ports; IP addresses; IP groups; service tags; and FQDNs. |
| `applicationRuleCollections` | HTTP, HTTPS, or MSSQL; ports; FQDNs; FQDN tags; URLs; and web categories. |

For example, the following `spec` fragment enables DNS proxy and adds a network rule collection that selects developer pods and permits TCP port 443 traffic to `google.com`. Don't add this optional example to the application-only test policy without reassessing the expected test results.

```yaml
dns:
  dnsProxy: Enabled
networkRuleCollections:
  - name: example-network-rules
    refs:
      - podSelector:
          matchLabels:
            role: developer
    action: Allow
    egress:
      - name: allow-google
        toPortProtocol:
          - protocolType: TCP
            port: 443
        to:
          - fqdn:
              - google.com
```

An FQDN destination in a network rule requires `dns.dnsProxy: Enabled`. Pods must also resolve the FQDN through the firewall so that pod DNS and firewall DNS don't resolve different IP addresses.

For this optional network-rule example, first attach the policy and wait for it to be ready as described in [Attach the policy](#attach-the-policy). Then configure pod DNS to use the firewall. One option is to set the virtual network's DNS server to the firewall's private IP:

```azurecli
az network vnet update \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VNET_NAME" \
  --dns-servers "$FW_PRIVATE_IP"
```

Changing virtual network DNS affects other workloads in that network. Record the original DNS configuration first, and restart the AKS nodes through your maintenance procedure so they pick up the change. Alternatively, configure CoreDNS to forward to the firewall. HTTP and HTTPS application rules don't require this DNS-resolution path.

Application rules can use `tlsInspection: Enabled`. TLS inspection also requires the appropriate firewall SKU, certificate configuration, and client trust. See [Azure Firewall Premium certificates](premium-certificates.md).

## Route AKS traffic through the firewall

> [!IMPORTANT]
> Configure routing before attaching a policy. Attachment turns off pod SNAT so that the firewall sees pod source IPs. Without the firewall route, pods can lose outbound connectivity as soon as the attachment takes effect.

When the controller creates a base policy, it already allows TCP port 443 to the `AzureKubernetesService` service tag, HTTPS port 443 to the `AzureKubernetesService` FQDN tag, and HTTPS port 443 to `*.afc.azure.com`.

If you use an existing firewall or supply `firewallPolicyReference`, configure equivalent [required AKS network and FQDN rules](/azure/aks/outbound-rules-control-egress) and HTTPS port 443 to `*.afc.azure.com` in your base policy before changing routing. The controller doesn't modify a supplied base policy. Maintain connectivity for cluster services, DNS, and image pulls. Don't edit the controller-managed child policy directly.

For a dedicated evaluation subnet without an existing route table, create the following table. Use the `FW_PRIVATE_IP` retrieved from the firewall's status, or the private IP of your existing firewall.

```bash
FW_ROUTE_TABLE_NAME='fw-rt'
FW_ROUTE_NAME='to-firewall'

az network route-table create \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --name "$FW_ROUTE_TABLE_NAME"

az network route-table route create \
  --resource-group "$RESOURCE_GROUP" \
  --route-table-name "$FW_ROUTE_TABLE_NAME" \
  --name "$FW_ROUTE_NAME" \
  --address-prefix 0.0.0.0/0 \
  --next-hop-type VirtualAppliance \
  --next-hop-ip-address "$FW_PRIVATE_IP"

az network vnet subnet update \
  --resource-group "$RESOURCE_GROUP" \
  --vnet-name "$VNET_NAME" \
  --name "$AKS_SUBNET_NAME" \
  --route-table "$FW_ROUTE_TABLE_NAME"

kubectl get nodes
```

If a route table already exists, add the firewall default route to that table instead of replacing it. Preserve its other required routes.

Associating a route table doesn't change the AKS `outboundType`. If your design requires a migration to `userDefinedRouting`, follow the supported migration procedure in [Customize cluster egress with outbound types](/azure/aks/egress-outboundtype). Complete the egress configuration and verify cluster connectivity before continuing.

## Attach the policy

After routing is in place, create `attachment.yaml`. This example references the policy and managed firewall created in this walkthrough.

```bash
cat > attachment.yaml <<EOF
apiVersion: firewall.networking.azure.io/v1alpha1
kind: SecurityPolicyAttachment
metadata:
  name: example-attachment
  namespace: default
spec:
  securityPolicyRefs:
    - name: example-securitypolicy-rules
      namespace: default
  firewallRef:
    name: example-firewall
    namespace: default
  aksWorkloadSubnets:
    - ${AKS_SUBNET_ID}
EOF

kubectl apply -f attachment.yaml
kubectl wait --for=jsonpath='{.status.conditions[?(@.type=="Deployment")].reason}'=Ready \
  securitypolicyattachment/example-attachment --namespace default --timeout=30m
kubectl get securitypolicyattachment example-attachment --namespace default -o yaml
```

For an existing firewall, replace the `firewallRef` name and namespace with an `id`:

```yaml
firewallRef:
  id: <firewall-resource-id>
```

| Field | Description |
| --- | --- |
| `securityPolicyRefs` | Policies to combine, identified by name and namespace. |
| `firewallRef` | Required. Either the managed firewall's Kubernetes name and namespace, or an existing firewall's Azure resource ID. |
| `aksWorkloadSubnets` | Required. Azure resource IDs of the AKS subnets protected by the firewall. |

Wait for the attachment's `Deployment` condition reason to become `Ready`, not just for its status to become true. Inspect reference-resolution and acceptance conditions too.

### Policy updates, precedence, and deletion

IDPS, threat intelligence, DNS, and SNAT are policy-wide settings. If multiple policies set the same setting, the first policy in `securityPolicyRefs` wins.

If Azure rejects a policy version, the controller retains its last known good version, or omits that policy if it has no good version. It doesn't retry the rejected version just because the underlying error disappears. Correct the problem and change the policy's `spec` before reapplying it.

Remove a policy from `securityPolicyRefs` before deleting the policy resource. Otherwise, deletion can hang. To recreate a rejected policy, detach it first, delete it, and then recreate and reattach it.

## Test application traffic

Create a test pod with the label selected by the policy:

```bash
kubectl apply -f - <<'EOF'
apiVersion: v1
kind: Pod
metadata:
  name: developer-pod
  namespace: default
  labels:
    role: developer
spec:
  containers:
    - name: developer
      image: mcr.microsoft.com/azure-cli:latest
      command: ["sleep", "infinity"]
EOF

kubectl wait --for=condition=Ready pod/developer-pod \
  --namespace default --timeout=5m
```

After the pod is running, open a shell:

```bash
kubectl exec --namespace default -it developer-pod -- /bin/bash
```

From the pod shell, test the permitted destinations:

```bash
curl --connect-timeout 10 --max-time 30 https://www.google.com
curl --connect-timeout 10 --max-time 30 https://www.microsoft.com
```

Then test a destination that isn't permitted by the example policy:

```bash
curl --connect-timeout 10 --max-time 30 https://www.bing.com
echo "$?"
```

In the intended isolated policy configuration, the first two requests are allowed and the Bing request is denied. For a denied HTTPS request, the firewall resets the TLS connection and curl returns exit code `35`. Correlate results with [Azure Firewall logs](monitor-firewall.md) and the deployed policy. A timeout or TLS error alone doesn't prove which firewall rule handled the request.

Rule and label changes can take a few minutes to reach the firewall after the attachment's `Deployment` condition has reason `Ready`. If a result isn't what you expect, allow time for convergence and retry before troubleshooting.

Exit the pod shell when you finish:

```bash
exit
```

### Verify a new pod matches the policy

After the existing policy converges, create another pod with the same label:

```bash
kubectl run developer-pod-2 --namespace default --labels=role=developer \
  --image=mcr.microsoft.com/azure-cli:latest --command -- sleep infinity

kubectl wait --for=condition=Ready pod/developer-pod-2 \
  --namespace default --timeout=5m

kubectl exec developer-pod-2 --namespace default -- \
  curl -sS -o /dev/null -w '%{http_code}\n' --max-time 30 https://www.microsoft.com
```

The new labeled pod becomes allowed within seconds without an Azure Resource Manager deployment. This fast-path pod update is separate from the convergence time for policy or label changes.

## Configure advanced policy settings

A `SecurityPolicy` can also define the following settings. A separate policy must be referenced by the attachment before it takes effect. Evaluate each capability separately rather than applying every example to the test environment.

| Setting | Options |
| --- | --- |
| IDPS | `Disabled`, `AlertOnly`, or `AlertAndDeny`; signature overrides; and private ranges. |
| Threat intelligence | `Disabled`, `AlertOnly`, or `AlertAndDeny`; allowed CIDRs and FQDNs. |
| DNS | `dnsProxy` set to `Enabled` or `Disabled`, with optional `customNameServers`. Without custom servers, the configuration uses Azure DNS. |
| SNAT | `Always`, `Never`, or `Exclude`. Specify `exclusions` only with `Exclude`. |

### IDPS

The following `spec` fragment shows IDPS configuration. A `ruleID` must be a number, not a quoted string. Replace the example signature ID `2000015` with the numeric ID of a signature that you want to override.

```yaml
idps:
  mode: AlertAndDeny
  ruleOverrides:
    - ruleID: 2000015
      mode: AlertOnly
  privateIPRanges:
    cidrs:
      - 10.0.0.0/8
      - 192.168.0.0/16
```

Don't configure `bypassList` on the controller-managed child policy. Azure rejects that setting. If you need a specific IDPS bypass, configure an appropriate base policy that you own.

### Threat intelligence

The following `spec` fragment shows how to allow specific CIDRs and FQDNs while using threat intelligence:

```yaml
threatIntelligence:
  mode: AlertAndDeny
  allow-list:
    cidrs:
      - 203.0.113.0/24
      - 198.51.100.0/24
    fqdns:
      - example.com
      - example.org
```

### DNS

The following `spec` fragment enables DNS proxy. Configure `customNameServers` with your own resolver addresses when your DNS design requires them.

```yaml
dns:
  dnsProxy: Enabled
  customNameServers:
    - <dns-server-ip-1>
    - <dns-server-ip-2>
```

### SNAT

The following `spec` fragment excludes the listed private ranges from SNAT:

```yaml
snat:
  action: Exclude
  exclusions:
    autoLearnPrivateRanges: Enabled
    privateRanges:
      - 10.0.0.0/8
      - 192.168.0.0/16
```

## Troubleshoot configuration and deployment

Start with the controller pods, image, and logs:

```bash
kubectl get pods --namespace "$HELM_NAMESPACE"

kubectl get pods --namespace "$HELM_NAMESPACE" \
  -l app=azurefirewall-controller \
  -o jsonpath='{.items[0].spec.containers[0].image}'

kubectl logs --namespace "$HELM_NAMESPACE" \
  -l app=azurefirewall-controller
```

The controller image uses the path `mcr.microsoft.com/firewall/images/azurefirewall-controller` with the selected version tag.

Inspect the resources and their status:

```bash
kubectl get azurefirewall -A -o yaml
kubectl get securitypolicy -A -o yaml
kubectl get securitypolicyattachment -A -o yaml
```

| Symptom | Checks |
| --- | --- |
| Authentication failure or HTTP 401 | Verify the OIDC issuer, federated subject, namespace, and workload identity configuration. |
| Authorization failure or HTTP 403 | Verify the controller identity's role assignments and their scopes. |
| Resource validation error | Inspect the resource's status conditions. Check that public IP and subnet values are valid Azure resource IDs. |
| Azure deployment failure | Check the reported error and the Azure Activity Log. Verify that referenced resources exist and use the required location. |
| Unexpected traffic result | Verify routing, attachment deployment, selectors, and other applicable firewall rules. |
| FQDN network rule is rejected | Enable `dns.dnsProxy: Enabled` in the policy. |
| FQDN network rule doesn't match | Make sure pods resolve the destination through the firewall, using virtual network DNS or CoreDNS forwarding. |
| `FirewallPolicyChildPolicyIntrusionDetectionBypassTrafficSettingConfigurationError` | Remove `bypassList` from the controller-managed policy. |
| Policy remains `Programmed=False` | Correct the rejected configuration and change the policy's `spec` before reapplying it. A rejected version isn't automatically retried. Alternatively, detach, delete, and recreate it. |
| Deleting a `SecurityPolicy` hangs | Remove it from the attachment's `securityPolicyRefs` before deleting it. |
| Pods lose internet connectivity after attachment | Verify the AKS subnet's `0.0.0.0/0` route to the firewall and the required AKS and `*.afc.azure.com` egress rules. |
| Labeled pods are unexpectedly denied | Allow time for convergence and retry. Check the preview region, non-Overlay Azure CNI, and `kube-system/azure-ip-masq-agent-config`. Verify that the firewall sees the pod IP rather than the node IP. |

For workload identity, inspect the service account and controller pod environment:

```bash
kubectl get serviceaccount azurefirewall-controller-sa \
  --namespace "$HELM_NAMESPACE" -o yaml

kubectl get pods --namespace "$HELM_NAMESPACE" \
  -l app=azurefirewall-controller \
  -o jsonpath='{.items[0].spec.containers[0].env}'

az role assignment list \
  --assignee "$IDENTITY_CLIENT_ID" \
  --scope "$RESOURCE_GROUP_ID"
```

Check the `azure.workload.identity/client-id` service-account annotation and the pod's `azure.workload.identity/use` label. The identity client ID is supplied through `AZURE_CLIENT_ID`. The workload identity configuration also supplies the tenant, federated token file, and authority host.

## Preview limitations

- Each AKS cluster supports only one `SecurityPolicyAttachment` and one Azure Firewall. Each firewall supports only one cluster.
- The preview inspects pod egress only and supports IPv4 only.
- Azure CNI Overlay isn't supported.
- Host-network pods use the node IP and can't be selected individually.
- Managed firewall and Firewall Policy deployments use the Premium SKU by default.
- You can use an existing Standard SKU firewall and policy for label-based rules, but Premium-only IDPS, TLS inspection, and URL filtering aren't available.
- A base policy must not already inherit from another base policy.
- You can change the parent policy through the Azure portal. The controller doesn't undo those parent-policy changes.
- Don't change the controller-managed child policy through the Azure portal. Kubernetes is its source of truth.
- An existing firewall must use a Firewall Policy. Classic rules aren't supported for this integration.
- The CRDs use `v1alpha1` and can change before general availability.
- The preview supports Azure public cloud only, in the listed preview regions.

## Clean up resources

Keep the controller running while you delete resources that it manages. If you uninstall the controller first, resource reconciliation and deletion might not complete.

1. Exit the test pod shell and delete the test pods.

   ```bash
   kubectl delete pod developer-pod developer-pod-2 --namespace default
   ```

1. Delete the attachment and wait for deletion to finish. Then wait about 90 seconds for pod SNAT to be restored.

   ```bash
   kubectl delete securitypolicyattachment example-attachment --namespace default
   kubectl wait --for=delete securitypolicyattachment/example-attachment \
     --namespace default --timeout=30m
   sleep 90
   ```

1. Restore the subnet's previous routing and the cluster's required outbound configuration according to your rollback plan. If the subnet originally had no route table, remove the evaluation table association. Otherwise, restore its original table.

   ```bash
   if [ -n "$ORIGINAL_ROUTE_TABLE_ID" ]; then
     az network vnet subnet update \
       --resource-group "$RESOURCE_GROUP" --vnet-name "$VNET_NAME" \
       --name "$AKS_SUBNET_NAME" --route-table "$ORIGINAL_ROUTE_TABLE_ID"
   else
     az network vnet subnet update \
       --resource-group "$RESOURCE_GROUP" --vnet-name "$VNET_NAME" \
       --name "$AKS_SUBNET_NAME" --remove routeTable
   fi
   ```

   If you changed virtual network DNS or CoreDNS for the optional network-rule example, restore the original settings too. Verify cluster connectivity. Don't leave a route pointing to a firewall that you're about to delete.

1. Delete the evaluation policy after removing its attachment.

   ```bash
   kubectl delete securitypolicy example-securitypolicy-rules --namespace default
   ```

1. If you created the managed firewall in this walkthrough, delete its custom resource while the controller is still running:

   ```bash
   kubectl delete azurefirewall example-firewall --namespace default
   kubectl wait --for=delete azurefirewall/example-firewall \
     --namespace default --timeout=40m
   ```

   Deletion can take 20-30 minutes. Verify removal of the associated Azure deployment. Don't delete an existing firewall that you supplied by resource ID.

1. After managed-resource deletion completes, uninstall the controller.

   ```bash
   helm uninstall azfw-controller --namespace "$HELM_NAMESPACE"
   ```

1. Delete the controller namespace only if you created it exclusively for this walkthrough and it contains no resources that you need.

The preceding commands don't delete the AKS cluster, virtual network, subnets, public IP resources, route table, identity, or role assignment. Remove only resources that you created exclusively for this evaluation after verifying that no other workload uses them. In particular, retain pre-existing networking resources and restore their original configuration.

## Related content

- [Azure Firewall rule processing](rule-processing.md)
- [Azure Firewall Premium certificates](premium-certificates.md)
- [Use Azure Firewall to protect AKS clusters](protect-azure-kubernetes-service.md)
- [Customize AKS cluster egress with outbound types](/azure/aks/egress-outboundtype)
