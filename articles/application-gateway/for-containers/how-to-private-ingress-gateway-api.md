---
title: Configure private ingress with Application Gateway for Containers - Gateway API
description: Learn how to configure private ingress on Application Gateway for Containers using the Gateway API, including private frontend creation, private endpoint connectivity, and end-to-end validation from a test virtual machine.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway-containers
ms.topic: how-to
ms.date: 11/03/2026
ms.author: mbender
# Customer intent: "As a cloud engineer, I want applications running in AKS to be accessible from trusted networks without exposing them to the public internet."
---

# Configure private ingress with Application Gateway for Containers - Gateway API

> [!IMPORTANT]
> Private ingress for Application Gateway for Containers is currently in **preview**.  
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article walks through configuring private ingress on Application Gateway for Containers using the Gateway API. The steps include:

- Creating a private frontend using the Azure REST API.
- Deploying Gateway API resources referencing the private frontend.
- Creating a test virtual network and virtual machine to represent a remote client.
- Creating a private endpoint in the test virtual network.
- Validating end-to-end connectivity from the virtual machine.

For a conceptual overview of how private ingress works, see [Private ingress with Application Gateway for Containers](private-ingress.md).

## Prerequisites

1. If following the BYO deployment strategy, ensure you set up your Application Gateway for Containers resources and ALB Controller ([Add-on](quickstart-deploy-application-gateway-for-containers-alb-controller-addon.md) or [Helm](quickstart-deploy-application-gateway-for-containers-alb-controller-helm.md)).
2. If following the ALB managed deployment strategy, ensure you provisioned your ALB Controller ([Add-on](quickstart-deploy-application-gateway-for-containers-alb-controller-addon.md) or [Helm](quickstart-deploy-application-gateway-for-containers-alb-controller-helm.md)) and provisioned the Application Gateway for Containers resources via the  [ApplicationLoadBalancer custom resource](quickstart-create-application-gateway-for-containers-managed-by-alb-controller.md).
3. Deploy sample HTTP application:<br>
  Apply the following deployment.yaml file on your cluster to create a sample web application to demonstrate traffic splitting / weighted round robin support.

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/refs/heads/main/articles/application-gateway/for-containers/examples/traffic-split-scenario/deployment.yaml
    ```
  
   This command creates the following resources on your cluster:

   - A namespace called `test-infra`
   - Two services called `backend-v1` and `backend-v2` in the `test-infra` namespace
   - Two deployments called `backend-v1` and `backend-v2` in the `test-infra` namespace

## Configure a private frontend

During preview, configure private frontends by using the Azure REST API with API version **2026-03-01**. The standard `az network alb frontend create` command doesn't yet expose the `publicNetworkAccess` property required to create a private frontend.

## Deploy the required Gateway API resources

# [BYO deployment](#tab/byo)

1. Set environment variables.

   ```bash
   RESOURCE_GROUP='<resource group name of the Application Gateway for Containers resource>'
   AGFC_NAME='<name of the Application Gateway for Containers resource>'
   FRONTEND_NAME='private-frontend'
   AGFC_ASSC_NAME='association'
   LOCATION=$(az network alb show -g $RESOURCE_GROUP -n $AGFC_NAME --query location -o tsv)
   SUBSCRIPTION_ID=$(az account show --query id -o tsv)
   ```

2. Create the private frontend by using `az rest` with API version **2026-03-01** and set the `publicNetworkAccess` property to `disabled`.

   ```azurecli-interactive
   az rest --method PUT \
     --url "https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.ServiceNetworking/trafficControllers/${AGFC_NAME}/frontends/${FRONTEND_NAME}?api-version=2026-03-01" \
     --body "{
       \"location\": \"${LOCATION}\",
       \"properties\": {
         \"publicNetworkAccess\": \"disabled\",
         \"association\": {
            \"id\": \"/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.ServiceNetworking/trafficControllers/${AGFC_NAME}/associations/${AGFC_ASSC_NAME}\"
          },
       }
     }"
   ```

3. Verify the frontend was created and note the fully qualified domain name (FQDN):

   ```azurecli-interactive
   az rest --method GET \
     --url "https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.ServiceNetworking/trafficControllers/${AGFC_NAME}/frontends/${FRONTEND_NAME}?api-version=2026-03-01" \
     --query "properties.fqdn" -o tsv
   ```

   The FQDN resolves only after a private endpoint is connected and approved. Direct internet resolution of the FQDN isn't possible for a private frontend.

4. Retrieve the Application Gateway for Containers resource ID for use in later steps.

   ```bash
   RESOURCE_ID=$(az network alb show -g $RESOURCE_GROUP -n $AGFC_NAME --query id -o tsv)
   echo $RESOURCE_ID
   ```

5. Create a `Gateway` resource.

Note the use of `azure-alb-internal` as the `gatewayClassName`, which references the private (non-internet-accessible) frontend:

   ```bash
   kubectl apply -f - <<EOF
   apiVersion: gateway.networking.k8s.io/v1
   kind: Gateway
   metadata:
     name: gateway-01
     namespace: test-infra
     annotations:
       alb.networking.azure.io/alb-id: $RESOURCE_ID
   spec:
     gatewayClassName: azure-alb-internal
     listeners:
     - name: http-listener
       port: 80
       protocol: HTTP
       allowedRoutes:
         namespaces:
           from: Same
     addresses:
     - type: alb.networking.azure.io/alb-frontend
       value: $FRONTEND_NAME
   EOF
   ```

# [ALB managed deployment](#tab/alb-managed)

Create a `Gateway` resource using `gatewayClassName: azure-alb-internal`. The ALB Controller automatically provisions a private frontend:

```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: gateway-01
  namespace: test-infra
  annotations:
    alb.networking.azure.io/alb-namespace: alb-test-infra
    alb.networking.azure.io/alb-name: alb-test
spec:
  gatewayClassName: azure-alb-internal
  listeners:
  - name: http-listener
    port: 80
    protocol: HTTP
    allowedRoutes:
      namespaces:
        from: Same
EOF
```

[!INCLUDE [application-gateway-for-containers-frontend-naming](../../../includes/application-gateway-for-containers-frontend-naming.md)]

---

After you create the `Gateway` resource, verify the status is valid and the listener is `Programmed`:

```bash
kubectl get gateway gateway-01 -n test-infra -o yaml
```

Look for a condition of type `Programmed` with status `True` under `status.conditions`. The controller doesn't assign an address until you connect and approve a private endpoint.

Create an `HTTPRoute` to route traffic to the backend services:

```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: http-route
  namespace: test-infra
spec:
  parentRefs:
  - name: gateway-01
  rules:
  - backendRefs:
    - name: backend-v1
      port: 8080
EOF
```

Verify the `HTTPRoute` is accepted:

```bash
kubectl get httproute http-route -n test-infra -o yaml
```

## Create a test virtual network and virtual machine

To demonstrate private endpoint connectivity, create a new virtual network in a separate resource group to represent a remote client environment. Deploy a virtual machine into this virtual network to test connectivity through the private endpoint.

```bash
PE_RESOURCE_GROUP='<resource group for the private endpoint and test VM>'
PE_LOCATION='<Azure region for the test resources>'
PE_VNET_NAME='pe-test-vnet'
PE_VNET_PREFIX='10.100.0.0/16'
PE_SUBNET_NAME='pe-subnet'
PE_SUBNET_PREFIX='10.100.0.0/24'
VM_SUBNET_NAME='vm-subnet'
VM_SUBNET_PREFIX='10.100.1.0/24'
VM_NAME='pe-test-vm'
VM_ADMIN_USER='azureuser'
```

1. Create the resource group.

   ```azurecli-interactive
   az group create --name $PE_RESOURCE_GROUP --location $PE_LOCATION
   ```

2. Create the virtual network with two subnets—one for the private endpoint and one for the virtual machine.

   ```azurecli-interactive
   az network vnet create \
     --resource-group $PE_RESOURCE_GROUP \
     --name $PE_VNET_NAME \
     --address-prefix $PE_VNET_PREFIX \
     --subnet-name $PE_SUBNET_NAME \
     --subnet-prefix $PE_SUBNET_PREFIX

   az network vnet subnet create \
     --resource-group $PE_RESOURCE_GROUP \
     --vnet-name $PE_VNET_NAME \
     --name $VM_SUBNET_NAME \
     --address-prefix $VM_SUBNET_PREFIX
   ```

3. Disable private endpoint network policies on the private endpoint subnet.

   ```azurecli-interactive
   az network vnet subnet update \
     --resource-group $PE_RESOURCE_GROUP \
     --vnet-name $PE_VNET_NAME \
     --name $PE_SUBNET_NAME \
     --disable-private-endpoint-network-policies true
   ```

4. Create the test virtual machine. When prompted, provide an SSH password or use `--ssh-key-values` to supply a public key.

   ```azurecli-interactive
   az vm create \
     --resource-group $PE_RESOURCE_GROUP \
     --name $VM_NAME \
     --image Ubuntu2204 \
     --vnet-name $PE_VNET_NAME \
     --subnet $VM_SUBNET_NAME \
     --admin-username $VM_ADMIN_USER \
     --generate-ssh-keys \
     --public-ip-sku Standard
   ```

## Create a private endpoint

Create a private endpoint in the test virtual network that targets the Application Gateway for Containers private frontend.

```bash
PE_NAME='agc-private-endpoint'
PE_CONNECTION_NAME="${FRONTEND_NAME}-connection"
```

```azurecli-interactive
az network private-endpoint create \
  --resource-group $PE_RESOURCE_GROUP \
  --name $PE_NAME \
  --vnet-name $PE_VNET_NAME \
  --subnet $PE_SUBNET_NAME \
  --private-connection-resource-id $AGFC_RESOURCE_ID \
  --group-id $FRONTEND_NAME \
  --connection-name $PE_CONNECTION_NAME
```

> [!NOTE]
> When the private endpoint is created in the same subscription as the Application Gateway for Containers resource, the connection may be approved automatically. For cross-subscription or cross-tenant scenarios, proceed to the approval step below.

## Approve the private endpoint connection

Retrieve and approve the pending private endpoint connection on the Application Gateway for Containers resource:

```azurecli-interactive
# Retrieve the pending connection ID
PENDING_CONNECTION_ID=$(az rest --method GET \
  --url "https://management.azure.com${AGFC_RESOURCE_ID}/frontends/${FRONTEND_NAME}?api-version=2026-03-01" \
  --query "properties.privateEndpointConnections[?properties.privateLinkServiceConnectionState.status=='Pending'].id | [0]" \
  -o tsv)

echo "Pending connection: $PENDING_CONNECTION_ID"

# Approve the connection
az rest --method POST \
  --url "https://management.azure.com${PENDING_CONNECTION_ID}/approve?api-version=2026-03-01" \
  --body '{"properties": {"description": "Approved"}}'
```

After approval, the private endpoint transitions to an **Approved** state and the Application Gateway for Containers FQDN becomes resolvable within the test virtual network.

## Configure DNS for the private endpoint

To resolve the Application Gateway for Containers private frontend FQDN to the private IP address allocated in the test virtual network, configure a DNS record in a private DNS zone linked to the test VNet, or add a host file entry on the test VM.

### Option 1: Add a host file entry on the test VM

1. Retrieve the private IP address allocated to the private endpoint:

   ```azurecli-interactive
   PRIVATE_IP=$(az network private-endpoint show \
     --resource-group $PE_RESOURCE_GROUP \
     --name $PE_NAME \
     --query "customDnsConfigs[0].ipAddresses[0]" -o tsv)

   echo "Private endpoint IP: $PRIVATE_IP"
   ```

2. Retrieve the Application Gateway for Containers frontend FQDN:

   ```azurecli-interactive
   AGC_FQDN=$(az rest --method GET \
     --url "https://management.azure.com${AGFC_RESOURCE_ID}/frontends/${FRONTEND_NAME}?api-version=2026-03-01" \
     --query "properties.fqdn" -o tsv)

   echo "AGC frontend FQDN: $AGC_FQDN"
   ```

3. SSH to the test VM and add a host file entry:

   ```bash
   # Get the public IP of the test VM
   VM_PUBLIC_IP=$(az vm show -d -g $PE_RESOURCE_GROUP -n $VM_NAME --query publicIps -o tsv)

   ssh $VM_ADMIN_USER@$VM_PUBLIC_IP "echo '$PRIVATE_IP $AGC_FQDN' | sudo tee -a /etc/hosts"
   ```

### Option 2: Use a private DNS zone

Create a private DNS zone linked to the test VNet and add an A record for the frontend FQDN pointing to the private endpoint IP address. This approach scales to multiple clients and VNets.

## Validate connectivity from the test VM

SSH to the test virtual machine and send a request to the private frontend FQDN. All traffic flows over the private endpoint—no internet path is used.

```bash
ssh $VM_ADMIN_USER@$VM_PUBLIC_IP

# From inside the VM, send a request to the private frontend
curl -v http://<AGC_FQDN>/
```

A successful response from `backend-v1` confirms that the private endpoint is connected, the connection is approved, DNS resolves to the private IP, and Application Gateway for Containers is routing traffic to the AKS backend.

## Clean up resources

To remove all resources created in this guide:

```azurecli-interactive
# Delete the test VNet and VM resource group
az group delete --name $PE_RESOURCE_GROUP --yes --no-wait

# Remove the private frontend
az network alb frontend delete -g $RESOURCE_GROUP --alb-name $AGFC_NAME -n $FRONTEND_NAME --yes

# Remove Kubernetes resources
kubectl delete httproute http-route -n test-infra
kubectl delete gateway gateway-01 -n test-infra
```

## Troubleshooting

**Q: Why does the FQDN of my private frontend resolve to 2001:db8::/32?**

**A:** The `2001:db8::/32` range is reserved for documentation and is returned when DNS resolution for `*.privatelink.alb.azure.com` is not configured correctly.

If you see an address in this range, verify that:

- Your DNS resolver can communicate with Azure DNS.
- The private DNS zone is linked to the virtual network containing your DNS resolver or, if using Azure DNS directly, your client.

## Related content

- [Private ingress with Application Gateway for Containers](private-ingress.md)
- [Application Gateway for Containers components](application-gateway-for-containers-components.md)
- [Web Application Firewall on Application Gateway for Containers](web-application-firewall.md)
- [Configure WAF on Application Gateway for Containers - Gateway API](how-to-waf-gateway-api.md)
- [Azure Private Link documentation](/azure/private-link/private-link-overview)
