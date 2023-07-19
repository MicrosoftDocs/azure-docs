---
title: Enable Group Managed Service Accounts (GMSA) for your Windows Server nodes on your Azure Kubernetes Service (AKS) cluster
description: Learn how to enable Group Managed Service Accounts (GMSA) for your Windows Server nodes on your Azure Kubernetes Service (AKS) cluster for securing your pods.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 11/01/2021
---

# Enable Group Managed Service Accounts (GMSA) for your Windows Server nodes on your Azure Kubernetes Service (AKS) cluster

[Group Managed Service Accounts (GMSA)][gmsa-overview] is a managed domain account for multiple servers that provides automatic password management, simplified service principal name (SPN) management and the ability to delegate the management to other administrators. AKS provides the ability to enable GMSA on your Windows Server nodes, which allows containers running on Windows Server nodes to integrate with and be managed by GMSA.


## Prerequisites

Enabling GMSA with Windows Server nodes on AKS requires:

* Kubernetes 1.19 or greater.
* Azure CLI version 2.35.0 or greater
* [Managed identities][aks-managed-id] with your AKS cluster.
* Permissions to create or update an Azure Key Vault.
* Permissions to configure GMSA on Active Directory Domain Service or on-premises Active Directory.
* The domain controller must have Active Directory Web Services enabled and must be reachable on port 9389 by the AKS cluster.

> [!NOTE]
> Microsoft also provides a purpose-built PowerShell module to configure gMSA on AKS. You can find more information on the module and how to use it in the article [gMSA on Azure Kubernetes Service](/virtualization/windowscontainers/manage-containers/gmsa-aks-ps-module).

## Configure GMSA on Active Directory domain controller

To use GMSA with AKS, you need both GMSA and a standard domain user credential to access the GMSA credential configured on your domain controller. To configure GMSA on your domain controller, see [Getting Started with Group Managed Service Accounts][gmsa-getting-started]. For the standard domain user credential, you can use an existing user or create a new one, as long as it has access to the GMSA credential.

> [!IMPORTANT]
> You must use either Active Directory Domain Service or on-prem Active Directory. At this time, you can't use Azure Active Directory to configure GMSA with an AKS cluster.

## Store the standard domain user credentials in Azure Key Vault

Your AKS cluster uses the standard domain user credentials to access the GMSA credentials from the domain controller. To provide secure access to those credentials for the AKS cluster, those credentials should be stored in Azure Key Vault. You can create a new key vault or use an existing key vault.

Use `az keyvault secret set` to store the standard domain user credential as a secret in your key vault. The following example stores the domain user credential with the key *GMSADomainUserCred* in the *MyAKSGMSAVault* key vault. You should replace the parameters with your own key vault, key, and domain user credential.

```azurecli
az keyvault secret set --vault-name MyAKSGMSAVault --name "GMSADomainUserCred" --value "$Domain\\$DomainUsername:$DomainUserPassword"
```

> [!NOTE]
> Use the Fully Qualified Domain Name for the Domain rather than the Partially Qualified Domain Name that may be used on internal networks.
>
> The above command escapes the `value` parameter for running the Azure CLI on a Linux shell. When running the Azure CLI command on Windows PowerShell, you don't need to escape characters in the `value` parameter.


## Optional: Use a custom VNET with custom DNS

Your domain controller needs to be configured through DNS so it's reachable by the AKS cluster. You can configure your network and DNS outside of your AKS cluster to allow your cluster to access the domain controller. Alternatively, you can configure a custom VNET with a custom DNS using Azure CNI with your AKS cluster to provide access to your domain controller. For more information, see [Configure Azure CNI networking in Azure Kubernetes Service (AKS)][aks-cni].

## Optional: Configure more than one DNS server

If you want to configure more than one DNS server for Windows GMSA in your AKS cluster, don't specify `--gmsa-dns-server`or `v--gmsa-root-domain-name`. Instead, you can add multiple DNS servers in the vnet by selecting Custom DNS and adding the DNS servers

## Optional: Use your own kubelet identity for your cluster

To provide the AKS cluster access to your key vault, the cluster kubelet identity needs access to your key vault. By default, when you create a cluster with managed identity enabled, a kubelet identity is automatically created. You can grant access to your key vault for this identity after cluster creation, which is done in a later step.

Alternatively, you can create your own identity and use this identity during cluster creation in a later step. For more information on the provided managed identities, see [Summary of managed identities][aks-managed-id-kubelet].

To create your own identity, use `az identity create` to create an identity. The following example creates a *myIdentity* identity in the *myResourceGroup* resource group.

```azurecli
az identity create --name myIdentity --resource-group myResourceGroup
```

You can grant your kubelet identity access to your key vault before or after you create your cluster. The following example uses `az identity list` to get the ID of the identity and set it to *MANAGED_ID* then uses `az keyvault set-policy` to grant the identity access to the *MyAKSGMSAVault* key vault.

```azurecli
MANAGED_ID=$(az identity list --query "[].id" -o tsv)
az keyvault set-policy --name "MyAKSGMSAVault" --object-id $MANAGED_ID --secret-permissions get
```

## Create AKS cluster

To use GMSA with your AKS cluster, use the *enable-windows-gmsa*, *gmsa-dns-server*, *gmsa-root-domain-name*, and *enable-managed-identity* parameters.

> [!NOTE]
> When creating a cluster with Windows Server node pools, you need to specify the administrator credentials when creating the cluster. The following commands prompt you for a username and set it WINDOWS_USERNAME for use in a later command (remember that the commands in this article are entered into a BASH shell).
>
> ```azurecli
> echo "Please enter the username to use as administrator credentials for Windows Server nodes on your cluster: " && read WINDOWS_USERNAME
> ```

Use `az aks create` to create an AKS cluster then `az aks nodepool add` to add a Windows Server node pool. The following example creates a *MyAKS* cluster in the *MyResourceGroup* resource group, enables GMSA, and then adds a new node pool named *npwin*.

> [!NOTE]
> If you are using a custom vnet, you also need to specify the id of the vnet using *vnet-subnet-id* and may need to also add *docker-bridge-address*, *dns-service-ip*, and *service-cidr* depending on your configuration.
>
> If you created your own identity for the kubelet identity, use the *assign-kubelet-identity* parameter to specify your identity.

```azurecli
DNS_SERVER=<IP address of DNS server>
ROOT_DOMAIN_NAME="contoso.com"

az aks create \
    --resource-group MyResourceGroup \
    --name MyAKS \
    --vm-set-type VirtualMachineScaleSets \
    --network-plugin azure \
    --load-balancer-sku standard \
    --windows-admin-username $WINDOWS_USERNAME \
    --enable-managed-identity \
    --enable-windows-gmsa \
    --gmsa-dns-server $DNS_SERVER \
    --gmsa-root-domain-name $ROOT_DOMAIN_NAME

az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKS \
    --os-type Windows \
    --name npwin \
    --node-count 1
```

You can also enable GMSA on existing clusters that already have Windows Server nodes and managed identities enabled using `az aks update`. For example:

```azurecli
az aks update \
    --resource-group MyResourceGroup \
    --name MyAKS \
    --enable-windows-gmsa \
    --gmsa-dns-server $DNS_SERVER \
    --gmsa-root-domain-name $ROOT_DOMAIN_NAME
```

After creating your cluster or updating your cluster, use `az keyvault set-policy` to grant the identity access to your key vault. The following example grants the kubelet identity created by the cluster access to the *MyAKSGMSAVault* key vault.

> [!NOTE]
> If you provided your own identity for the kubelet identity, skip this step.

```azurecli
MANAGED_ID=$(az aks show -g MyResourceGroup -n MyAKS --query "identityProfile.kubeletidentity.objectId" -o tsv)

az keyvault set-policy --name "MyAKSGMSAVault" --object-id $MANAGED_ID --secret-permissions get
```

## Install GMSA cred spec

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials][] command. The following example gets credentials for the AKS cluster named *MyAKS* in the *MyResourceGroup*:

```azurecli
az aks get-credentials --resource-group MyResourceGroup --name MyAKS
```

Create a *gmsa-spec.yaml* with the following, replacing the placeholders with your own values.

```yml
apiVersion: windows.k8s.io/v1alpha1
kind: GMSACredentialSpec
metadata:
  name: aks-gmsa-spec  # This name can be changed, but it will be used as a reference in the pod spec
credspec:
  ActiveDirectoryConfig:
    GroupManagedServiceAccounts:
    - Name: $GMSA_ACCOUNT_USERNAME
      Scope: $NETBIOS_DOMAIN_NAME
    - Name: $GMSA_ACCOUNT_USERNAME
      Scope: $DNS_DOMAIN_NAME
    HostAccountConfig:
      PluginGUID: '{CCC2A336-D7F3-4818-A213-272B7924213E}'
      PortableCcgVersion: "1"
      PluginInput: "ObjectId=$MANAGED_ID;SecretUri=$SECRET_URI"  # SECRET_URI takes the form https://$akvName.vault.azure.net/secrets/$akvSecretName
  CmsPlugins:
  - ActiveDirectory
  DomainJoinConfig:
    DnsName: $DNS_DOMAIN_NAME
    DnsTreeName: $DNS_ROOT_DOMAIN_NAME
    Guid:  $AD_DOMAIN_OBJECT_GUID
    MachineAccountName: $GMSA_ACCOUNT_USERNAME
    NetBiosName: $NETBIOS_DOMAIN_NAME
    Sid: $GMSA_SID
```



Create a *gmsa-role.yaml* with the following.

```yml
#Create the Role to read the credspec
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aks-gmsa-role
rules:
- apiGroups: ["windows.k8s.io"]
  resources: ["gmsacredentialspecs"]
  verbs: ["use"]
  resourceNames: ["aks-gmsa-spec"]
```

Create a *gmsa-role-binding.yaml* with the following.

```yml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: allow-default-svc-account-read-on-aks-gmsa-spec
  namespace: default
subjects:
- kind: ServiceAccount
  name: default
  namespace: default
roleRef:
  kind: ClusterRole
  name: aks-gmsa-role
  apiGroup: rbac.authorization.k8s.io
```

Use `kubectl apply` to apply the changes from *gmsa-spec.yaml*, *gmsa-role.yaml*, and *gmsa-role-binding.yaml*.

```azurecli
kubectl apply -f gmsa-spec.yaml
kubectl apply -f gmsa-role.yaml
kubectl apply -f gmsa-role-binding.yaml
```

## Verify GMSA is installed and working

Create a *gmsa-demo.yaml* with the following.

```yml
---
kind: ConfigMap
apiVersion: v1
metadata:
  labels:
   app: gmsa-demo
  name: gmsa-demo
  namespace: default
data:
  run.ps1: |
   $ErrorActionPreference = "Stop"

   Write-Output "Configuring IIS with authentication."

   # Add required Windows features, since they are not installed by default.
   Install-WindowsFeature "Web-Windows-Auth", "Web-Asp-Net45"

   # Create simple ASP.NET page.
   New-Item -Force -ItemType Directory -Path 'C:\inetpub\wwwroot\app'
   Set-Content -Path 'C:\inetpub\wwwroot\app\default.aspx' -Value 'Authenticated as <B><%=User.Identity.Name%></B>, Type of Authentication: <B><%=User.Identity.AuthenticationType%></B>'

   # Configure IIS with authentication.
   Import-Module IISAdministration
   Start-IISCommitDelay
   (Get-IISConfigSection -SectionPath 'system.webServer/security/authentication/windowsAuthentication').Attributes['enabled'].value = $true
   (Get-IISConfigSection -SectionPath 'system.webServer/security/authentication/anonymousAuthentication').Attributes['enabled'].value = $false
   (Get-IISServerManager).Sites[0].Applications[0].VirtualDirectories[0].PhysicalPath = 'C:\inetpub\wwwroot\app'
   Stop-IISCommitDelay

   Write-Output "IIS with authentication is ready."

   C:\ServiceMonitor.exe w3svc
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: gmsa-demo
  name: gmsa-demo
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gmsa-demo
  template:
    metadata:
      labels:
        app: gmsa-demo
    spec:
      securityContext:
        windowsOptions:
          gmsaCredentialSpecName: aks-gmsa-spec
      containers:
      - name: iis
        image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        imagePullPolicy: IfNotPresent
        command:
         - powershell
        args:
          - -File
          - /gmsa-demo/run.ps1
        volumeMounts:
          - name: gmsa-demo
            mountPath: /gmsa-demo
      volumes:
      - configMap:
          defaultMode: 420
          name: gmsa-demo
        name: gmsa-demo
      nodeSelector:
        kubernetes.io/os: windows
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: gmsa-demo
  name: gmsa-demo
  namespace: default
spec:
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: gmsa-demo
  type: LoadBalancer
```

Use `kubectl apply` to apply the changes from *gmsa-demo.yaml*

```azurecli
kubectl apply -f gmsa-demo.yaml
```

Use `kubectl get service` to display the IP address of the example application.

```console
kubectl get service gmsa-demo --watch
```

Initially the *EXTERNAL-IP* for the *gmsa-demo* service is shown as *pending*.

```output
NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
gmsa-demo          LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
```

When the *EXTERNAL-IP* address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process. The following example output shows a valid public IP address assigned to the service:

```output
gmsa-demo  LoadBalancer   10.0.37.27   EXTERNAL-IP   80:30572/TCP   2m
```

To verify GMSA is working and configured correctly, open a web browser to the external IP address of *gmsa-demo* service. Authenticate with `$NETBIOS_DOMAIN_NAME\$AD_USERNAME` and password and confirm you see `Authenticated as $NETBIOS_DOMAIN_NAME\$AD_USERNAME, Type of Authentication: Negotiate` .

## Troubleshooting

### No authentication is prompted when loading the page

If the page loads, but you aren't prompted to authenticate, use `kubectl logs POD_NAME` to display the logs of your pod and verify you see *IIS with authentication is ready*.

> [!NOTE]
> Windows containers won't show logs on kubectl by default. To enable Windows containers to show logs, you need to embed the Log Monitor tool on your Windows image. More information is available [here](https://github.com/microsoft/windows-container-tools).

### Connection timeout when trying to load the page

If you receive a connection timeout when trying to load the page, verify the sample app is running with `kubectl get pods --watch`. Sometimes the external IP address for the sample app service is available before the sample app pod is running.

### Pod fails to start and a *winapi error* shows in the pod events

After running `kubectl get pods --watch` and waiting several minutes, if your pod doesn't start, run `kubectl describe pod POD_NAME`. If you see a *winapi error* in the pod events, this is likely an error in your GMSA cred spec configuration. Verify all the replacement values in *gmsa-spec.yaml* are correct, rerun `kubectl apply -f gmsa-spec.yaml`, and redeploy the sample application.


[aks-cni]: configure-azure-cni.md
[aks-managed-id]: use-managed-identity.md
[aks-managed-id-kubelet]: use-managed-identity.md#summary-of-managed-identities
[az aks get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[gmsa-getting-started]: /windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts
[gmsa-overview]: /windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview
[rdp]: rdp.md
