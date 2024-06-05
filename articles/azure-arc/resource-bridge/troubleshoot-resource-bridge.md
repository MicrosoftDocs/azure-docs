---
title: Troubleshoot Azure Arc resource bridge issues
description: This article tells how to troubleshoot and resolve issues with the Azure Arc resource bridge when trying to deploy or connect to the service.
ms.date: 11/03/2023
ms.topic: conceptual
---

# Troubleshoot Azure Arc resource bridge issues

This article provides information on troubleshooting and resolving issues that could occur while attempting to deploy, use, or remove the Azure Arc resource bridge. The resource bridge is a packaged virtual machine, which hosts a *management* Kubernetes cluster. For general information, see [Azure Arc resource bridge overview](./overview.md).

## General issues

### Logs collection

For issues encountered with Arc resource bridge, collect logs for further investigation using the Azure CLI [`az arcappliance logs`](/cli/azure/arcappliance/logs) command. This command needs to be run from the same management machine that was used to run commands to deploy the Arc resource bridge. If you're using a different machine to collect logs, you need to run the `az arcappliance get-credentials` command first before collecting logs.

If there's a problem collecting logs, most likely the management machine is unable to reach the Appliance VM. Contact your network administrator to allow SSH communication from the management machine to the Appliance VM on TCP port 22. 

You can collect the Arc resource bridge logs by passing either the appliance VM IP or the kubeconfig in the logs command.

To collect Arc resource bridge logs on VMware using the appliance VM IP address: 

   ```azurecli
   az arcappliance logs vmware --ip <appliance VM IP> --username <vSphere username> --password <vSphere password> --address <vCenter address> --out-dir <path to output directory>
   ```

To collect Arc resource bridge logs for Azure Stack HCI using the appliance VM IP address: 

   ```azurecli
   az arcappliance logs hci --ip <appliance VM IP> --cloudagent <cloud agent service IP/FQDN> --loginconfigfile <file path of kvatoken.tok> 
   ```

If you're unsure of your appliance VM IP, there's also the option to use the kubeconfig. You can retrieve the kubeconfig by running the [get-credentials command](/cli/azure/arcappliance) then run the logs command.

To retrieve the kubeconfig and log key then collect logs for Arc-enabled VMware from a different machine than the one used to deploy Arc resource bridge for Arc-enabled VMware:

   ```azurecli
az account set -s <subscription id>
az arcappliance get-credentials -n <Arc resource bridge name> -g <resource group name> 
az arcappliance logs vmware --kubeconfig kubeconfig --out-dir <path to specified output directory>
   ```

### Arc resource bridge is offline

If the resource bridge is offline, this is typically due to a networking change in the infrastructure, environment or cluster that stops the appliance VM from being able to  communicate with its counterpart Azure resource. If you're unable to determine what changed, you can reboot the appliance VM, collect logs and submit a support ticket for further investigation. 

### Remote PowerShell isn't supported

If you run `az arcappliance` CLI commands for Arc Resource Bridge via remote PowerShell, you might experience various problems. For instance, you might see an [authentication handshake failure error when trying to install the resource bridge on an Azure Stack HCI cluster](#authentication-handshake-failure) or another type of error. Using `az arcappliance` commands from remote PowerShell isn't currently supported. Instead, sign in to the node through Remote Desktop Protocol (RDP) or use a console session.

### Resource bridge configurations can't be updated

In this release, all the parameters are specified at time of creation. To update the Azure Arc resource bridge, you must delete it and redeploy it again. For example, if you specified the wrong location, or subscription during deployment, later the resource creation fails. If you only try to recreate the resource without redeploying the resource bridge VM, you'll see the status stuck at `WaitForHeartBeat`. To resolve this issue, delete the appliance and update the appliance YAML file. Then redeploy and create the resource bridge.

### Appliance Network Unavailable 

If Arc resource bridge is experiencing a network problem, you may see an "Appliance Network Unavailable" error. In general, any network or infrastructure connectivity issue to the appliance VM may cause this error. This error can also surface as "Error while dialing dial tcp xx.xx.xxx.xx:55000: connect: no route to host". The problem could be that communication from the host to the Arc resource bridge VM needs to be opened over TCP port 22 with the help of your network administrator. It could be that there was a temporary network issue not allowing the host to reach the Arc resource bridge VM and once the network issue is resolved, you can retry the operation. You can also check that the appliance VM for Arc resource bridge isn't stopped or offline. In the case of Azure Stack HCI, the host storage may be full and the storage needs to be addressed. 

### Token refresh error

When you run the Azure CLI commands, the following error might be returned: *The refresh token has expired or is invalid due to sign-in frequency checks by conditional access.* The error occurs because when you sign in to Azure, the token has a maximum lifetime. When that lifetime is exceeded, you need to sign in to Azure again by using the `az login` command.

### Default host resource pools are unavailable for deployment

When using the `az arcappliance createconfig` or `az arcappliance run` command, there will be an interactive experience which shows the list of the VMware entities where you can select to deploy the virtual appliance. This list will show all user-created resource pools along with default cluster resource pools, but the default host resource pools aren't listed. When the appliance is deployed to a host resource pool, there's no high availability if the host hardware fails. Because of this, we recommend that you don't try to deploy the appliance in a host resource pool.

### Resource bridge status "Offline" and `provisioningState` "Failed"

When deploying Arc resource bridge, the bridge might appear to be successfully deployed, because no errors were encountered when running `az arcappliance deploy` or `az arcappliance create`. However, when viewing the bridge in Azure portal, you might see status shows as **Offline**, and `az arcappliance show` might show the `provisioningState` as **Failed**. This happens when required providers aren't registered before the bridge is deployed.

To resolve this problem, delete the resource bridge, register the providers, then redeploy the resource bridge.

1. Delete the resource bridge:

   ```azurecli
   az arcappliance delete <fabric> --config-file <path to appliance.yaml>
   ```

1. Register the providers:

   ```azurecli
   az provider register --namespace Microsoft.ExtendedLocation –-wait
   az provider register --namespace Microsoft.ResourceConnector –-wait
   ```

1. Redeploy the resource bridge.

> [!NOTE]
> Partner products (such as Arc-enabled VMware vSphere) might have their own required providers to register. To see additional providers that must be registered, see the product's documentation.

### Expired credentials in the appliance VM

Arc resource bridge consists of an appliance VM that is deployed to the on-premises infrastructure. The appliance VM maintains a connection to the management endpoint of the on-premises infrastructure using locally stored credentials. If these credentials aren't updated, the resource bridge is no longer able to communicate with the management endpoint. This can cause problems when trying to upgrade the resource bridge or manage VMs through Azure. To fix this, the credentials in the appliance VM need to be updated. For more information, see [Update credentials in the appliance VM](maintenance.md#update-credentials-in-the-appliance-vm).

### Private link is unsupported

Arc resource bridge doesn't support private link. All calls coming from the appliance VM shouldn't be going through your private link setup. The Private Link IPs may conflict with the appliance IP pool range, which isn't configurable on the resource bridge. Arc resource bridge reaches out to [required URLs](network-requirements.md#firewallproxy-url-allowlist) that shouldn't go through a private link connection. You must deploy Arc resource bridge on a separate network segment unrelated to the private link setup.


## Networking issues

### Back-off pulling image error

When trying to deploy Arc resource bridge, you might see an error that contains `back-off pulling image \\\"url"\\\: FailFastPodCondition`. This error is caused when the appliance VM can't reach the URL specified in the error. To resolve this issue, make sure the appliance VM meets system requirements, including internet access connectivity to [required allowlist URLs](network-requirements.md).

### Not able to connect to URL

If you receive an error that contains `Not able to connect to https://example.url.com`, check with your network administrator to ensure your network allows all of the required firewall and proxy URLs to deploy Arc resource bridge. For more information, see [Azure Arc resource bridge network requirements](network-requirements.md).

### Http2 server sent GOAWAY

When trying to deploy Arc resource bridge, you might receive an error message similar to:

`"errorResponse": "{\n\"message\": \"Post \\\"https://region.dp.kubernetesconfiguration.azure.com/azure-arc-appliance-k8sagents/GetLatestHelmPackagePath?api-version=2019-11-01-preview\\u0026releaseTrain=stable\\\": http2: server sent GOAWAY and closed the connection; LastStreamID=1, ErrCode=NO_ERROR, debug=\\\"\\\"\"\n}"`

This occurs when a firewall or proxy has SSL/TLS inspection enabled and blocks http2 calls from the machine used to deploy the resource bridge. To confirm this is the problem, run the following PowerShell cmdlet to invoke the web request with http2 (requires PowerShell version 7 or above), replacing the region in the URL and api-version (ex:2019-11-01) with values from the error:

`Invoke-WebRequest -HttpVersion 2.0 -UseBasicParsing -Uri https://region.dp.kubernetesconfiguration.azure.com/azure-arc-appliance-k8sagents/GetLatestHelmPackagePath?api-version=2019-11-01-preview"&"releaseTrain=stable -Method Post -Verbose`

If the result is `The response ended prematurely while waiting for the next frame from the server`, then the http2 call is being blocked and needs to be allowed. Work with your network administrator to disable the SSL/TLS inspection to allow http2 calls from the machine used to deploy the bridge.

### No such host - .local not supported
When trying to set the configuration for Arc resource bridge, you might receive an error message similar to:

`"message": "Post \"https://esx.lab.local/52c-acac707ce02c/disk-0.vmdk\": dial tcp: lookup esx.lab.local: no such host"`

This occurs when a `.local` path is provided for a configuration setting, such as proxy, dns, datastore or management endpoint (such as vCenter). Arc resource bridge appliance VM uses Azure Linux OS, which doesn't support `.local` by default. A workaround could be to provide the IP address where applicable.

### Azure Arc resource bridge is unreachable

Azure Arc resource bridge runs a Kubernetes cluster, and its control plane requires a static IP address. The IP address is specified in the `infra.yaml` file. If the IP address is assigned from a DHCP server, the address can change if it's not reserved. Rebooting the Azure Arc resource bridge or VM can trigger an IP address change, resulting in failing services.

Intermittently, the resource bridge can lose the reserved IP configuration. This is due to the behavior described in [loss of VIPs when systemd-networkd is restarted](https://github.com/acassen/keepalived/issues/1385). When the IP address isn't assigned to the Azure Arc resource bridge VM, any call to the resource bridge API server will fail. As a result, you can't create any new resource through the resource bridge, ranging from connecting to Azure Arc private cloud, create a custom location, create a VM, etc.

Another possible cause is slow disk access. Azure Arc resource bridge uses etcd which requires 10 ms latency or less per [recommendation](https://docs.openshift.com/container-platform/4.6/scalability_and_performance/recommended-host-practices.html#recommended-etcd-practices_). If the underlying disk has low performance, it can impact the operations, and causing failures.

To resolve this issue, reboot the resource bridge VM, and it should recover its IP address. If the address is assigned from a DHCP server, reserve the IP address associated with the resource bridge.

### SSL proxy configuration issues

Be sure that the proxy server on your management machine trusts both the SSL certificate for your SSL proxy and the SSL certificate of the Microsoft download servers. For more information, see [SSL proxy configuration](network-requirements.md#ssl-proxy-configuration).

### No such host - dp.kubernetesconfiguration.azure.com

An error that contains `dial tcp: lookup westeurope.dp.kubernetesconfiguration.azure.com: no such host` while deploying Arc resource bridge means that the configuration dataplane is currently unavailable in the specified region. The service may be temporarily unavailable. Please wait for the service to be available and then retry the deployment.

### Proxy connect tcp - No such host for Arc resource bridge required URL

An error that contains an Arc resource bridge required URL with the message `proxyconnect tcp: dial tcp: lookup http: no such host` indicates that DNS is not able to resolve the URL. The error may look similar to the example below, where the required URL is `https://msk8s.api.cdp.microsoft.com`:

`Error:  { _errorCode_: _InvalidEntityError_, _errorResponse_: _{\n\_message\_: \_Post \\\_https://msk8s.api.cdp.microsoft.com/api/v1.1/contents/default/namespaces/default/names/arc-appliance-stable-catalogs-ext/versions/latest?action=select\\\_: POST https://msk8s.api.cdp.microsoft.com/api/v1.1/contents/default/namespaces/default/names/arc-appliance-stable-catalogs-ext/versions/latest?action=select giving up after 6 attempt(s): Post \\\_https://msk8s.api.cdp.microsoft.com/api/v1.1/contents/default/namespaces/default/names/arc-appliance-stable-catalogs-ext/versions/latest?action=select\\\_: proxyconnect tcp: dial tcp: lookup http: no such host\_\n}_ }`

This error can occur if the DNS settings provided during deployment are not correct or there is a problem with the DNS server(s). You can check if your DNS server is able to resolve the url by running the following command from the management machine or a machine that has access to the DNS server(s): 

```
nslookup
> set debug
> <hostname> <DNS server IP>
```

In order to resolve the error, your DNS server(s) must be configured to resolve all Arc resource bridge required URLs and the DNS server(s) should be correctly provided during deployment of Arc resource bridge.

### KVA timeout error

The KVA timeout error is a generic error that can be the result of a variety of network misconfigurations that involve the management machine, Appliance VM, or Control Plane IP not having communication with each other, to the internet, or required URLs. This communication failure is often due to issues with DNS resolution, proxy settings, network configuration, or internet access. 

For clarity, management machine refers to the machine where deployment CLI commands are being run. Appliance VM is the VM that hosts Arc resource bridge. Control Plane IP is the IP of the control plane for the Kubernetes management cluster in the Appliance VM.

#### Top causes of the KVA timeout error  

- Management machine is unable to communicate with Control Plane IP and Appliance VM IP.
- Appliance VM is unable to communicate with the management machine, vCenter endpoint (for VMware), or MOC cloud agent endpoint (for Azure Stack HCI).  
- Appliance VM doesn't have internet access.
- Appliance VM has internet access, but connectivity to one or more required URLs is being blocked, possibly due to a proxy or firewall.
- Appliance VM is unable to reach a DNS server that can resolve internal names, such as vCenter endpoint for vSphere or cloud agent endpoint for Azure Stack HCI. The DNS server must also be able to resolve external addresses, such as Azure service addresses and container registry names.  
- Proxy server configuration on the management machine or Arc resource bridge configuration files is incorrect. This can impact both the management machine and the Appliance VM. When the `az arcappliance prepare` command is run, the management machine won't be able to connect and download OS images if the host proxy isn't correctly configured. Internet access on the Appliance VM might be broken by incorrect or missing proxy configuration, which impacts the VM’s ability to pull container images.  

#### Troubleshoot KVA timeout error

To resolve the error, one or more network misconfigurations might need to be addressed. Follow the steps below to address the most common reasons for this error.

1. When there's a problem with deployment, the first step is to collect logs by Appliance VM IP (not by kubeconfig, as the kubeconfig could be empty if the deploy command didn't complete). Problems collecting logs are most likely due to the management machine being unable to reach the Appliance VM.

   Once logs are collected, extract the folder and open kva.log. Review the kva.log for more information on the failure to help pinpoint the cause of the KVA timeout error.

1. The management machine must be able to communicate with the Appliance VM IP and Control Plane IP. Ping the Control Plane IP and Appliance VM IP from the management machine and verify there's a response from both IPs.

   If a request times out, the management machine can't communicate with the IP(s). This could be caused by a closed port, network misconfiguration or a firewall block. Work with your network administrator to allow communication between the management machine to the Control Plane IP and Appliance VM IP.

1. Appliance VM IP and Control Plane IP must be able to communicate with the management machine and vCenter endpoint (for VMware) or MOC cloud agent endpoint (for HCI). Work with your network administrator to ensure the network is configured to permit this. This might require adding a firewall rule to open port 443 from the Appliance VM IP and Control Plane IP to vCenter or port 65000 and 55000 for Azure Stack HCI MOC cloud agent. Review [network requirements for Azure Stack HCI](/azure-stack/hci/manage/azure-arc-vm-management-prerequisites#network-port-requirements) and [VMware](../vmware-vsphere/quick-start-connect-vcenter-to-arc-using-script.md) for Arc resource bridge.

1. Appliance VM IP and Control Plane IP need internet access to [these required URLs](#not-able-to-connect-to-url). Azure Stack HCI requires [additional URLs](/azure-stack/hci/manage/azure-arc-vm-management-prerequisites). Work with your network administrator to ensure that the IPs can access the required URLs.

1. In a non-proxy environment, the management machine must have external and internal DNS resolution. The management machine must be able to reach a DNS server that can resolve internal names such as vCenter endpoint for vSphere or cloud agent endpoint for Azure Stack HCI. The DNS server also needs to be able to [resolve external addresses](#not-able-to-connect-to-url), such as Azure URLs and OS image download URLs. Work with your system administrator to ensure that the management machine has internal and external DNS resolution. In a proxy environment, the DNS resolution on the proxy server should resolve internal endpoints and [required external addresses](#not-able-to-connect-to-url).

   To test DNS resolution to an internal address from the management machine in a non-proxy scenario, open command prompt and run `nslookup <vCenter endpoint or HCI MOC cloud agent IP>`. You should receive an answer if the management machine has internal DNS resolution in a non-proxy scenario.  

1. Appliance VM needs to be able to reach a DNS server that can resolve internal names such as vCenter endpoint for vSphere or cloud agent endpoint for Azure Stack HCI. The DNS server also needs to be able to resolve external/internal addresses, such as Azure service addresses and container registry names for download of the Arc resource bridge container images from the cloud.

   Verify that the DNS server IP used to create the configuration files has internal and external address resolution. If not, [delete the appliance](/cli/azure/arcappliance/delete), recreate the Arc resource bridge configuration files with the correct DNS server settings, and then deploy Arc resource bridge using the new configuration files.
   
## Move Arc resource bridge location

Resource move of Arc resource bridge isn't currently supported. You'll need to delete the Arc resource bridge, then re-deploy it to the desired location. 

## Azure Arc-enabled VMs on Azure Stack HCI issues

For general help resolving issues related to Azure Arc-enabled VMs on Azure Stack HCI, see [Troubleshoot Azure Arc-enabled virtual machines](/azure-stack/hci/manage/troubleshoot-arc-enabled-vms).

### Authentication handshake failure

When running an `az arcappliance` command, you might see a connection error: `authentication handshake failed: x509: certificate signed by unknown authority`

This is usually caused when trying to run commands from remote PowerShell, which isn't supported by Azure Arc resource bridge.

To install Azure Arc resource bridge on an Azure Stack HCI cluster, `az arcappliance` commands must be run locally on a node in the cluster. Sign in to the node through Remote Desktop Protocol (RDP) or use a console session to run these commands.

## Azure Arc-enabled VMware VCenter issues

### vSphere SDK client 403 Forbidden or 404 not found

If you receive an error that contains `errorCode_: _CreateConfigKvaCustomerError_, _errorResponse_: _error getting the vsphere sdk client: POST \_/sdk\_: 403 Forbidden` or `404 not found` while deploying Arc resource bridge, this is most likely due to an incorrect vCenter URL being provided during configuration file creation where you're prompted to enter the vCenter address as either FQDN or IP address. There are different ways to find your vCenter address. One option is to access the vSphere client via its web interface. The vCenter FQDN or IP address is typically what you use in the browser to access the vSphere client. If you're already logged in, you can look at the browser's address bar; the URL you use to access vSphere is your vCenter server's FQDN or IP address. Alternatively, after logging in, go to the Menu > Administration section. Under System Configuration, choose Nodes. Your vCenter server instance(s) will be listed there along with its FQDN. Verify your vCenter address and then re-try the deployment.

### Pre-deployment validation errors

If you're receiving a variety of `pre-deployment validation of your download\upload connectivity wasn't successful` errors, such as: 

`Pre-deployment validation of your download/upload connectivity wasn't successful. {\\n  \\\_code\\\_: \\\_ImageProvisionError\\\_,\\n  \\\_message\\\_: \\\_Post \\\\\\\_https://vcenter-server.com/nfc/unique-identifier/disk-0.vmdk\\\\\\\_: Service Unavailable`

`Pre-deployment validation of your download/upload connectivity wasn't successful. {\\n  \\\_code\\\_: \\\_ImageProvisionError\\\_,\\n  \\\_message\\\_: \\\_Post \\\\\\\_https://vcenter-server.com/nfc/unique-identifier/disk-0.vmdk\\\\\\\_: dial tcp 172.16.60.10:443: connectex: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond.`

`Pre-deployment validation of your download/upload connectivity wasn't successful. {\\n  \\\_code\\\_: \\\_ImageProvisionError\\\_,\\n  \\\_message\\\_: \\\_Post \\\\\\\_https://vcenter-server.com/nfc/unique-identifier/disk-0.vmdk\\\\\\\_: use of closed network connection.`

`Pre-deployment validation of your download/upload connectivity wasn't successful. {\\n  \\\_code\\\_: \\\_ImageProvisionError\\\_,\\n  \\\_message\\\_: \\\_Post \\\\\\\_https://vcenter-server.com/nfc/unique-identifier/disk-0.vmdk\\\\\\\_: dial tcp: lookup hostname.domain: no such host`

A combination of these errors usually indicates that the management machine has lost connection to the datastore or there's a networking issue causing the datastore to be unreachable. This connection is needed in order to upload the OVA from the management machine used to build the appliance VM in vCenter. The connection between the management machine and datastore needs to be reestablished, then retry deployment of Arc resource bridge.

### x509 certificate has expired or isn't yet valid

When you deploy Arc resource bridge, you may encounter the error: 

`Error: { _errorCode_: _PostOperationsError_, _errorResponse_: _{\n\_message\_: \_{\\n  \\\_code\\\_: \\\_GuestInternetConnectivityError\\\_,\\n  \\\_message\\\_: \\\_Not able to connect to https://msk8s.api.cdp.microsoft.com. Error returned: action failed after 3 attempts: Get \\\\\\\_https://msk8s.api.cdp.microsoft.com\\\\\\\_: x509: certificate has expired or isn't yet valid: current time 2022-01-18T11:35:56Z is before 2023-09-07T19:13:21Z. Arc Resource Bridge network and internet connectivity validation failed: http-connectivity-test-arc. 1. Please check your networking setup and ensure the URLs mentioned in : https://aka.ms/AAla73m are reachable from the Appliance VM.   2. Check firewall/proxy settings` 

This error is caused when there's a clock/time difference between ESXi host(s) and the management machine where the deployment commands for Arc resource bridge are being executed. To resolve this issue, turn on NTP time sync on the ESXi host(s) and confirm that the management machine is also synced to NTP, then try the deployment again.

### Error during host configuration

If you have been using the same template to deploy and delete the Arc resource bridge multiple times, you might encounter the following error:

`Appliance cluster deployment failed with error: Error: An error occurred during host configuration`

To resolve this issue, manually delete the existing template. Then run [`az arcappliance prepare`](/cli/azure/arcappliance/prepare) to download a new template for deployment.

### Unable to find folders

When deploying the resource bridge on VMware vCenter, you specify the folder in which the template and VM will be created. The folder must be VM and template folder type. Other types of folder, such as storage folders, network folders, or host and cluster folders, can't be used for the resource bridge deployment.

### Insufficient permissions

When deploying the resource bridge on VMware vCenter, you might get an error saying that you have insufficient permission. To resolve this issue, make sure that the user account being used to deploy the resource bridge has all of the following privileges in VMware vCenter and then try again.

**Datastore** 

- Allocate space
- Browse datastore
- Low level file operations

**Folder** 

- Create folder

**vSphere Tagging**

- Assign or Unassign vSphere Tag

**Network** 

- Assign network

**Resource**

- Assign virtual machine to resource pool
- Migrate powered off virtual machine
- Migrate powered on virtual machine

**Sessions**

- Validate session

**vApp**

- Assign resource pool
- Import 

**Virtual machine**

- Change Configuration
  - Acquire disk lease
  - Add existing disk
  - Add new disk
  - Add or remove device
  - Advanced configuration
  - Change CPU count
  - Change Memory
  - Change Settings
  - Change resource
  - Configure managedBy
  - Display connection settings
  - Extend virtual disk
  - Modify device settings
  - Query Fault Tolerance compatibility
  - Query unowned files
  - Reload from path
  - Remove disk
  - Rename
  - Reset guest information
  - Set annotation
  - Toggle disk change tracking
  - Toggle fork parent
  - Upgrade virtual machine compatibility
- Edit Inventory
  - Create from existing
  - Create new
  - Register
  - Remove
  - Unregister
- Guest operations
  - Guest operation alias modification
  - Guest operation modifications
  - Guest operation program execution
  - Guest operation queries
- Interaction
  - Connect devices
  - Console interaction
  - Guest operating system management by VIX API
  - Install VMware Tools
  - Power off
  - Power on
  - Reset
  - Suspend
- Provisioning
  - Allow disk access
  - Allow file access
  - Allow read-only disk access
  - Allow virtual machine download
  - Allow virtual machine files upload
  - Clone virtual machine
  - Deploy template
  - Mark as template
  - Mark as virtual machine
  - Customize guest
- Snapshot management
  - Create snapshot
  - Remove snapshot
  - Revert to snapshot

## Next steps

[Understand recovery operations for resource bridge in Azure Arc-enabled VMware vSphere disaster scenarios](../vmware-vsphere/disaster-recovery.md)

If you don't see your problem here or you can't resolve your issue, try one of the following channels for support:

- Get answers from Azure experts through [Microsoft Q&A](/answers/topics/azure-arc.html).
- Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.
- [Open an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md).

