---
title: Create an application gateway with HTTP to HTTPS redirection using the Azure portal
description: Learn how to create an application gateway with redirected traffic from HTTP to HTTPS using the Azure portal.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: article
ms.date: 12/7/2018
ms.author: victorh

---
# Create an application gateway with HTTP to HTTPS redirection using the Azure portal

You can use the Azure portal to create an [application gateway](overview.md) with a certificate for SSL termination. A routing rule is used to redirect HTTP traffic to the HTTPS port in your application gateway. In this example, you also create a [virtual machine scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) for the backend pool of the application gateway that contains two virtual machine instances.

In this article, you learn how to:

> [!div class="checklist"]
> * Create a self-signed certificate
> * Set up a network
> * Create an application gateway with the certificate
> * Add a listener and redirection rule
> * Create a virtual machine scale set with the default backend pool

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

This tutorial requires the Azure PowerShell module version 1.0.0 or later to create a certificate and install IIS. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). To run the commands in this tutorial, you also need to run `Login-AzAccount` to create a connection with Azure.

## Create a self-signed certificate

For production use, you should import a valid certificate signed by a trusted provider. For this tutorial, you create a self-signed certificate using [New-SelfSignedCertificate](https://docs.microsoft.com/powershell/module/pkiclient/new-selfsignedcertificate). You can use [Export-PfxCertificate](https://docs.microsoft.com/powershell/module/pkiclient/export-pfxcertificate) with the Thumbprint that was returned to export a pfx file from the certificate.

```powershell
New-SelfSignedCertificate `
  -certstorelocation cert:\localmachine\my `
  -dnsname www.contoso.com
```

You should see something like this result:

```
PSParentPath: Microsoft.PowerShell.Security\Certificate::LocalMachine\my

Thumbprint                                Subject
----------                                -------
E1E81C23B3AD33F9B4D1717B20AB65DBB91AC630  CN=www.contoso.com
```

Use the thumbprint to create the pfx file:

```powershell
$pwd = ConvertTo-SecureString -String "Azure123456!" -Force -AsPlainText
Export-PfxCertificate `
  -cert cert:\localMachine\my\E1E81C23B3AD33F9B4D1717B20AB65DBB91AC630 `
  -FilePath c:\appgwcert.pfx `
  -Password $pwd
```

## Create an application gateway

A virtual network is needed for communication between the resources that you create. Two subnets are created in this example: one for the application gateway, and the other for the backend servers. You can create a virtual network at the same time that you create the application gateway.

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. Click **Create a resource** found on the upper left-hand corner of the Azure portal.
3. Select **Networking** and then select **Application Gateway** in the Featured list.
4. Enter these values for the application gateway:

   - *myAppGateway* - for the name of the application gateway.
   - *myResourceGroupAG* - for the new resource group.

     ![Create new application gateway](./media/create-url-route-portal/application-gateway-create.png)

5. Accept the default values for the other settings and then click **OK**.
6. Click **Choose a virtual network**, click **Create new**, and then enter these values for the virtual network:

   - *myVNet* - for the name of the virtual network.
   - *10.0.0.0/16* - for the virtual network address space.
   - *myAGSubnet* - for the subnet name.
   - *10.0.1.0/24* - for the subnet address space.

     ![Create virtual network](./media/create-url-route-portal/application-gateway-vnet.png)

7. Click **OK** to create the virtual network and subnet.
8. Under **Frontend IP configuration**, ensure **IP address type** is **Public**, and **Create new** is selected. Enter *myAGPublicIPAddress* for the name. Accept the default values for the other settings and then click **OK**.
9. Under **Listener configuration**, select **HTTPS**, then select **Select a file** and navigate to the *c:\appgwcert.pfx* file and select **Open**.
10. Type *appgwcert* for the cert name and *Azure123456!* for the password.
11. Leave the Web application firewall disabled, and then select **OK**.
12. Review the settings on the summary page, and then select **OK** to create the network resources and the application gateway. It may take several minutes for the application gateway to be created, wait until
    the deployment finishes successfully before moving on to the next section.

### Add a subnet

1. Select **All resources** in the left-hand menu, and then select **myVNet** from the resources list.
2. Select **Subnets**, and then click **Subnet**.

    ![Create subnet](./media/create-url-route-portal/application-gateway-subnet.png)

3. Type *myBackendSubnet* for the name of the subnet.
4. Type *10.0.2.0/24* for the address range, and then select **OK**.

## Add a listener and redirection rule

### Add the listener

First, add the listener named *myListener* for port 80.

1. Open the **myResourceGroupAG** resource group and select **myAppGateway**.
2. Select **Listeners** and then select **+ Basic**.
3. Type *MyListener* for the name.
4. Type *httpPort* for the new frontend port name and *80* for the port.
5. Ensure the protocol is set to **HTTP**, and then select **OK**.

### Add a routing rule with a redirection configuration

1. On **myAppGateway**, select **Rules** and then select **+Basic**.
2. For the **Name**, type *Rule2*.
3. Ensure **MyListener** is selected for the listener.
4. Select the **Configure redirection** check box.
5. For **Redirection type**, select **Permanent**.
6. For **Redirection target**, select **Listener**.
7. Ensure the **Target listener** is set to **appGatewayHttpListener**.
8. Select the **Include query string** and **Include path** check boxes.
9. Select **OK**.

## Create a virtual machine scale set

In this example, you create a virtual machine scale set to provide servers for the backend pool in the application gateway.

1. On the portal upper left corner, select **+Create a resource**.
2. Select **Compute**.
3. In the search box, type *scale set* and press Enter.
4. Select **Virtual machine scale set**, and then select **Create**.
5. For **Virtual machine scale set name**, type *myvmss*.
6. For Operating system disk image,** ensure **Windows Server 2016 Datacenter** is selected.
7. For **Resource group**, select **myResourceGroupAG**.
8. For **User name**, type *azureuser*.
9. For **Password**, type *Azure123456!* and confirm the password.
10. For **Instance count**, ensure the value is **2**.
11. For **Instance size**, select **D2s_v3**.
12. Under **Networking**, ensure **Choose Load balancing options** is set to **Application Gateway**.
13. Ensure **Application gateway** is set to **myAppGateway**.
14. Ensure **Subnet** is set to **myBackendSubnet**.
15. Select **Create**.

### Associate the scale set with the proper backend pool

The virtual machine scale set portal UI creates a new backend pool for the scale set, but you want to associate it with your existing appGatewayBackendPool.

1. Open the **myResourceGroupAg** resource group.
2. Select **myAppGateway**.
3. Select **Backend pools**.
4. Select **myAppGatewaymyvmss**.
5. Select **Remove all targets from backend pool**.
6. Select **Save**.
7. After this process completes, select the **myAppGatewaymyvmss** backend pool, select **Delete** and then **OK** to confirm.
8. Select **appGatewayBackendPool**.
9. Under **Targets**, select **VMSS**.
10. Under **VMSS**, select **myvmss**.
11. Under **Network Interface Configurations**, select **myvmssNic**.
12. Select **Save**.

### Upgrade the scale set

Finally, you must upgrade the scale set with these changes.

1. Select the **myvmss** scale set.
2. Under **Settings**, select **Instances**.
3. Select both instances, and then select **Upgrade**.
4. Select **Yes** to confirm.
5. After this completes, go back to the **myAppGateway** and select **Backend pools**. You should now see that the **appGatewayBackendPool** has two targets, and  **myAppGatewaymyvmss** has zero targets.
6. Select **myAppGatewaymyvmss**, and then select **Delete**.
7. Select **OK** to confirm.

### Install IIS

An easy way to install IIS on the scale set is to use PowerShell. From the portal, click the Cloud Shell icon and ensure that **PowerShell** is selected.

Paste the following code into the PowerShell window and press Enter.

```azurepowershell
$publicSettings = @{ "fileUris" = (,"https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/application-gateway/iis/appgatewayurl.ps1"); 
  "commandToExecute" = "powershell -ExecutionPolicy Unrestricted -File appgatewayurl.ps1" }
$vmss = Get-AzVmss -ResourceGroupName myResourceGroupAG -VMScaleSetName myvmss
Add-AzVmssExtension -VirtualMachineScaleSet $vmss `
  -Name "customScript" `
  -Publisher "Microsoft.Compute" `
  -Type "CustomScriptExtension" `
  -TypeHandlerVersion 1.8 `
  -Setting $publicSettings
Update-AzVmss `
  -ResourceGroupName myResourceGroupAG `
  -Name myvmss `
  -VirtualMachineScaleSet $vmss
```

### Upgrade the scale set

After changing the instances with IIS , you must once again upgrade the scale set with this change.

1. Select the **myvmss** scale set.
2. Under **Settings**, select **Instances**.
3. Select both instances, and then select **Upgrade**.
4. Select **Yes** to confirm.

## Test the application gateway

You can get the application public IP address from the application gateway Overview page.

1. Select **myAppGateway**.
2. On the **Overview** page, note the IP address under **Frontend public IP address**.

3. Copy the public IP address, and then paste it into the address bar of your browser. For example, http://52.170.203.149

   ![Secure warning](./media/redirect-http-to-https-powershell/application-gateway-secure.png)

4. To accept the security warning if you used a self-signed certificate, select **Details** and then **Go on to the webpage**. Your secured IIS website is then displayed as in the following example:

   ![Test base URL in application gateway](./media/redirect-http-to-https-powershell/application-gateway-iistest.png)

## Next steps

Learn how to [Create an application gateway with internal redirection](redirect-internal-site-powershell.md).
