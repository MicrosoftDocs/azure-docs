---
title: Enable Group Managed Service Accounts (GMSA) for your Windows Server nodes on your Azure Kubernetes Service (AKS) cluster
description: Learn how to enable Group Managed Service Accounts (GMSA) for your Windows Server nodes on your Azure Kubernetes Service (AKS) cluster to secure your pods.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 08/30/2023
---

# Enable Group Managed Service Accounts (GMSA) for your Windows Server nodes on your Azure Kubernetes Service (AKS) cluster

[Group Managed Service Accounts (GMSA)][gmsa-overview] is a managed domain account for multiple servers that provides automatic password management, simplified service principal name (SPN) management, and the ability to delegate management to other administrators. With Azure Kubernetes Service (AKS), you can enable GMSA on your Windows Server nodes, which allows containers running on Windows Server nodes to integrate with and be managed by GMSA.

## Prerequisites

* Kubernetes 1.19 or greater. To check your version, see [Check for available upgrades](./upgrade-cluster.md#check-for-available-aks-cluster-upgrades). To upgrade your version, see [Upgrade AKS cluster](./upgrade-cluster.md#upgrade-an-aks-cluster).
* Azure CLI version 2.35.0 or greater. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* [Managed identities][aks-managed-id] enabled on your AKS cluster.
* Permissions to create or update an Azure Key Vault.
* Permissions to configure GMSA on Active Directory Domain Service or on-premises Active Directory.
* The domain controller must have Active Directory Web Services enabled and must be reachable on port 9389 by the AKS cluster.

> [!NOTE]
> Microsoft also provides a purpose-built PowerShell module to configure gMSA on AKS. For more information, see [gMSA on Azure Kubernetes Service](/virtualization/windowscontainers/manage-containers/gmsa-aks-ps-module).

## Configure GMSA on Active Directory domain controller

To use GMSA with AKS, you need a standard domain user credential to access the GMSA credential configured on your domain controller. To configure GMSA on your domain controller, see [Get started with Group Managed Service Accounts][gmsa-getting-started]. For the standard domain user credential, you can use an existing user or create a new one, as long as it has access to the GMSA credential.

> [!IMPORTANT]
> You must use either Active Directory Domain Service or on-premises Active Directory. At this time, you can't use Microsoft Entra ID to configure GMSA with an AKS cluster.

## Store the standard domain user credentials in Azure Key Vault

Your AKS cluster uses the standard domain user credentials to access the GMSA credentials from the domain controller. To provide secure access to those credentials for the AKS cluster, you should store them in Azure Key Vault.

1. If you don't already have an Azure key vault, create one using the [`az keyvault create`][az-keyvault-create] command.

    ```azurecli-interactive
    az keyvault create --resource-group myResourceGroup --name myGMSAVault
    ```

2. Store the standard domain user credential as a secret in your key vault using the [`az keyvault secret set`][az-keyvault-secret-set] command. The following example stores the domain user credential with the key *GMSADomainUserCred* in the *myGMSAVault* key vault.

    ```azurecli-interactive
    az keyvault secret set --vault-name myGMSAVault --name "GMSADomainUserCred" --value "$Domain\\$DomainUsername:$DomainUserPassword"
    ```

    > [!NOTE]
    > Make sure to use the Fully Qualified Domain Name for the domain.

### Optional: Use a custom VNet with custom DNS

You need to configure your domain controller through DNS so it's reachable by the AKS cluster. You can configure your network and DNS outside of your AKS cluster to allow your cluster to access the domain controller. Alternatively, you can use Azure CNI to configure a custom VNet with a custom DNS on your AKS cluster to provide access to your domain controller. For more information, see [Configure Azure CNI networking in Azure Kubernetes Service (AKS)][aks-cni].

### Optional: Configure more than one DNS server

If you want to configure more than one DNS server for Windows GMSA in your AKS cluster, don't specify `--gmsa-dns-server`or `v--gmsa-root-domain-name`. Instead, you can add multiple DNS servers in the VNet by selecting *Custom DNS* and adding the DNS servers.

### Optional: Use your own kubelet identity for your cluster

To provide the AKS cluster access to your key vault, the cluster kubelet identity needs access to your key vault. When you create a cluster with managed identity enabled, a kubelet identity is automatically created by default.

You can either [grant access to your key vault for the identity after cluster creation](#enable-gmsa-on-existing-cluster) or create your own identity to use before cluster creation using the following steps:

1. Create a kubelet identity using the [`az identity create`][az-identity-create] command.

    ```azurecli-interactive
    az identity create --name myIdentity --resource-group myResourceGroup
    ```

2. Get the ID of the identity using the [`az identity list`][az-identity-list] command and set it to a variable named *MANAGED_ID*.

    ```azurecli-interactive
    MANAGED_ID=$(az identity list --query "[].id" -o tsv)
    ```

3. Grant the identity access to your key vault using the [`az keyvault set-policy`][az-keyvault-set-policy] command.

    ```azurecli-interactive
    az keyvault set-policy --name "myGMSAVault" --object-id $MANAGED_ID --secret-permissions get
    ```

## Enable GMSA on a new AKS cluster

1. Create administrator credentials to use during cluster creation. The following commands prompt you for a username and set it to *WINDOWS_USERNAME* for use in a later command.

    ```azurecli-interactive
    echo "Please enter the username to use as administrator credentials for Windows Server nodes on your cluster: " && read WINDOWS_USERNAME 
    ```

2. Create an AKS cluster using the [`az aks create`][az-aks-create] command with the following parameters:

    * `--enable-managed-identity`: Enables managed identity for the cluster.
    * `--enable-windows-gmsa`: Enables GMSA for the cluster.
    * `--gmsa-dns-server`: The IP address of the DNS server.
    * `--gmsa-root-domain-name`: The root domain name of the DNS server.

    ```azurecli-interactive
    DNS_SERVER=<IP address of DNS server>
    ROOT_DOMAIN_NAME="contoso.com"

    az aks create \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --vm-set-type VirtualMachineScaleSets \
        --network-plugin azure \
        --load-balancer-sku standard \
        --windows-admin-username $WINDOWS_USERNAME \
        --enable-managed-identity \
        --enable-windows-gmsa \
        --gmsa-dns-server $DNS_SERVER \
        --gmsa-root-domain-name $ROOT_DOMAIN_NAME
    ```

    > [!NOTE]
    >
    > * If you're using a custom VNet, you need to specify the VNet ID using the `vnet-subnet-id` parameter, and you may need to also add the `docker-bridge-address`, `dns-service-ip`, and `service-cidr` parameters depending on your configuration.
    >
    > * If you created your own identity for the kubelet identity, use the `assign-kubelet-identity` parameter to specify your identity.

3. Add a Windows Server node pool using the [`az aks nodepool add`][az-aks-nodepool-add] command.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --os-type Windows \
        --name npwin \
        --node-count 1
    ```

### Enable GMSA on existing cluster

* Enable GMSA on an existing cluster with Windows Server nodes and managed identities enabled using the [`az aks update`][az-aks-update] command.

    ```azurecli-interactive
    az aks update \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --enable-windows-gmsa \
        --gmsa-dns-server $DNS_SERVER \
        --gmsa-root-domain-name $ROOT_DOMAIN_NAME
    ```

## Grant access to your key vault for the kubelet identity

> [!NOTE]
> Skip this step if you provided your own identity for the kubelet identity.

* Grant access to your key vault for the kubelet identity using the [`az keyvault set-policy`][az-keyvault-set-policy] command.

    ```azurecli-interactive
    MANAGED_ID=$(az aks show -g myResourceGroup -n myAKSCluster --query "identityProfile.kubeletidentity.objectId" -o tsv)
    az keyvault set-policy --name "myGMSAVault" --object-id $MANAGED_ID --secret-permissions get
    ```

## Install GMSA cred spec

1. Configure `kubectl` to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

2. Create a new YAML named *gmsa-spec.yaml* and paste in the following YAML. Make sure you replace the placeholders with your own values.

    ```YAML
    apiVersion: windows.k8s.io/v1
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

> [!NOTE]
> AKS has upgraded the `apiVersion` of `GMSACredentialSpec` from `windows.k8s.io/v1alpha1` to `windows.k8s.io/v1` in release v20230903.

3. Create a new YAML named *gmsa-role.yaml* and paste in the following YAML.

    ```YAML
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

4. Create a new YAML named *gmsa-role-binding.yaml* and paste in the following YAML.

    ```YAML
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

5. Apply the changes from *gmsa-spec.yaml*, *gmsa-role.yaml*, and *gmsa-role-binding.yaml* using the `kubectl apply` command.

    ```azurecli-interactive
    kubectl apply -f gmsa-spec.yaml
    kubectl apply -f gmsa-role.yaml
    kubectl apply -f gmsa-role-binding.yaml
    ```

## Verify GMSA installation

1. Create a new YAML named *gmsa-demo.yaml* and paste in the following YAML.

    ```YAML
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

2. Apply the changes from *gmsa-demo.yaml* using the `kubectl apply` command.

    ```azurecli-interactive
    kubectl apply -f gmsa-demo.yaml
    ```

3. Get the IP address of the sample application using the `kubectl get service` command.

    ```azurecli-interactive
    kubectl get service gmsa-demo --watch
    ```

    Initially, the `EXTERNAL-IP` for the `gmsa-demo` service shows as *pending*:

    ```output
    NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
    gmsa-demo          LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
    ```

4. When the `EXTERNAL-IP` address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process.

    The following example output shows a valid public IP address assigned to the service:

    ```output
    gmsa-demo  LoadBalancer   10.0.37.27   EXTERNAL-IP   80:30572/TCP   2m
    ```

5. Open a web browser to the external IP address of the `gmsa-demo` service.
6. Authenticate with the `$NETBIOS_DOMAIN_NAME\$AD_USERNAME` and password and confirm you see `Authenticated as $NETBIOS_DOMAIN_NAME\$AD_USERNAME, Type of Authentication: Negotiate`.

### Disable GMSA on an existing cluster

* Disable GMSA on an existing cluster with Windows Server nodes using the [`az aks update`][az-aks-update] command.

    ```azurecli-interactive
    az aks update \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --disable-windows-gmsa 
    ```
> [!NOTE]
> You can re-enable GMSA on an existing cluster by using the [az aks update][az-aks-update] command.

## Troubleshooting

### No authentication is prompted when loading the page

If the page loads, but you aren't prompted to authenticate, use the `kubectl logs POD_NAME` command to display the logs of your pod and verify you see *IIS with authentication is ready*.

> [!NOTE]
> Windows containers won't show logs on kubectl by default. To enable Windows containers to show logs, you need to embed the Log Monitor tool on your Windows image. For more information, see [Windows Container Tools](https://github.com/microsoft/windows-container-tools).

### Connection timeout when trying to load the page

If you receive a connection timeout when trying to load the page, verify the sample app is running using the `kubectl get pods --watch` command. Sometimes the external IP address for the sample app service is available before the sample app pod is running.

### Pod fails to start and a *winapi error* shows in the pod events

If your pod doesn't start after running the `kubectl get pods --watch`  command and waiting several minutes, use the `kubectl describe pod POD_NAME` command. If you see a *winapi error* in the pod events, it's likely an error in your GMSA cred spec configuration. Verify all the replacement values in *gmsa-spec.yaml* are correct, rerun `kubectl apply -f gmsa-spec.yaml`, and redeploy the sample application.

## Next steps

* Learn more about [Windows Server containers on AKS](./windows-faq.md).

<!-- LINKS - internal -->
[aks-cni]: configure-azure-cni.md
[aks-managed-id]: use-managed-identity.md
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[gmsa-getting-started]: /windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts
[gmsa-overview]: /windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-identity-create]: /cli/azure/identity#az_identity_create
[az-identity-list]: /cli/azure/identity#az_identity_list
[az-keyvault-create]: /cli/azure/keyvault#az_keyvault_create
[az-keyvault-secret-set]: /cli/azure/keyvault/secret#az_keyvault_secret_set
[az-keyvault-set-policy]: /cli/azure/keyvault#az_keyvault_set_policy
