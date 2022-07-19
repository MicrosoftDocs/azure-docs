---
title: Deploy Azure Monitor for SAP Solutions with the Azure portal
description: Learn how to use a browser method for deploying Azure Monitor for SAP Solutions.
author: sameeksha91
ms.author: sakhare
ms.topic: how-to
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.date: 07/18/2022
---

# Deploy Azure Monitor for SAP Solutions by using the Azure portal

In this article, we'll walk through deploying Azure Monitor for SAP solutions (AMS) from the [Azure portal](https://azure.microsoft.com/features/azure-portal). Using the portal's browser-based interface, we'll deploy AMS and configure providers.

This content applies to both versions of the service, AMS and AMS (classic).
## Sign in to the portal

Sign in to the [Azure portal](https://portal.azure.com).

## Create a monitoring resource

###### For Azure Monitor for SAP solutions


1. In Azure **Search box**, select **Azure Monitor for SAP solutions** 

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-1.png" alt-text="Screenshot that shows selecting the Azure Monitor for SAP solutions offer from Azure Marketplace." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-1.png":::

2. On the **Basics** tab, provide the required values. If applicable, you can use an existing Log Analytics workspace.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-2.png" alt-text="Screenshot that shows configuration options on the Basics tab." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-2.png":::

   When you're selecting a virtual network, ensure that the systems you want to monitor are reachable from within that virtual network. 

   > [!IMPORTANT]
   > Selecting **Share** for **Share data with Microsoft support** enables our support teams to help you with troubleshooting.

## Configure providers

### SAP NetWeaver provider

The SAP start service provides a host of services, including monitoring the SAP system. We're using SAPControl, which is a SOAP web service interface that exposes these capabilities. The SAPControl web service interface differentiates between [protected and unprotected](https://wiki.scn.sap.com/wiki/display/SI/Protected+web+methods+of+sapstartsrv) web service methods. For how to configure authorization for SAPControl, see [SAP Note 1563660](https://launchpad.support.sap.com/#/notes/0001563660).

To fetch specific metrics, you need to unprotect some methods for the current release. Follow these steps for each SAP system:

1. Open an SAP GUI connection to the SAP server.
2. Sign in by using an administrative account.
3. Execute transaction RZ10.
4. Select the appropriate profile (*DEFAULT.PFL*).
5. Select **Extended Maintenance** > **Change**. 
6. Select the profile parameter "service/protectedwebmethods" and modify to have the following value, then click Copy:  

   ```service/protectedwebmethods instruction
      SDEFAULT -GetQueueStatistic -ABAPGetWPTable -EnqGetStatistic -GetProcessList

7. Go back and select **Profile** > **Save**.
8. After saving the changes for this parameter, please restart the SAPStartSRV service on each of the instances in the SAP system. (Restarting the services will not restart the SAP system; it will only restart the SAPStartSRV service (in Windows) or daemon process (in Unix/Linux))
   8a. On Windows systems, this can be done in a single window using the SAP Microsoft Management Console (MMC) / SAP Management Console(MC).  Right-click on each instance and choose All Tasks -> Restart Service.
![MMC](https://user-images.githubusercontent.com/75772258/126453939-daf1cf6b-a940-41f6-98b5-3abb69883520.png)

   8b. On Linux systems, use the below command where NN is the SAP instance number to restart the host which is logged into.
   
   ```RestartService
   sapcontrol -nr <NN> -function RestartService
   
9. Once the SAP service is restarted, please check to ensure the updated web method protection exclusion rules have been applied for each instance by running the following command: 

**Logged as \<sidadm\>** 
   `sapcontrol -nr <NN> -function ParameterValue service/protectedwebmethods`

**Logged as different user** 
   `sapcontrol -nr <NN> -function ParameterValue service/protectedwebmethods -user "<adminUser>" "<adminPassword>"`

   The output should look like :-
   ![SS](https://user-images.githubusercontent.com/75772258/126454265-d73858c3-c32d-4afe-980c-8aba96a0b2a4.png)

10. To conclude and validate, a test query can be done against web methods to validate ( replace the hostname , instance number and method name ) leverage the below powershell script 

```Powershell command to test unprotect method 
$SAPHostName = "<hostname>"
$InstanceNumber = "<instancenumber>"
$Function = "ABAPGetWPTable"
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
$sapcntrluri = "https://" + $SAPHostName + ":5" + $InstanceNumber + "14/?wsdl"
$sapcntrl = New-WebServiceProxy -uri $sapcntrluri -namespace WebServiceProxy -class sapcntrl
$FunctionObject = New-Object ($sapcntrl.GetType().NameSpace + ".$Function")
$sapcntrl.$Function($FunctionObject)
```
11. **Repeat Steps 3-10 for each instance profile **.

>[!Important] 
>It is critical that the sapstartsrv service is restarted on each instance of the SAP system for the SAPControl web methods to be unprotected.  These read-only SOAP API are required for the NetWeaver provider to fetch metric data from the SAP System and failure to unprotect these methods will lead to empty or missing visualizations on the NetWeaver metric workbook.
   
>[!Tip]
> Use an access control list (ACL) to filter the access to a server port. For more information, see [this SAP note](https://launchpad.support.sap.com/#/notes/1495075).

To install the NetWeaver provider on the Azure portal:

1. Make sure you've completed the earlier prerequisite steps and that the server has been restarted.
1. On the Azure portal, under **Azure Monitor for SAP Solutions**, select **Add provider**, and then:

   1. For **Type**, select **SAP NetWeaver**.

   1. For **Hostname**, enter the host name of the SAP system.

   1. For **Subdomain**, enter a subdomain if one applies.


![Azure Monitor for SAP solutions Quick Start](./media/azure-monitor-sap/azure-monitor-quickstart-1-new.png)

2. On the **Basics** tab, provide the required values. If applicable, you can use an existing Log Analytics workspace.
 
![Azure Monitor for SAP solutions Quick Start 2](./media/azure-monitor-sap/azure-monitor-quickstart-2-new.png)

###### For Azure Monitor for SAP solutions (Classic)

1. In Azure **Marketplace** or **Search**, select **Azure Monitor for SAP Solutions (Classic)**.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-1.png" alt-text="Screenshot that shows selecting the Azure Monitor for SAP solutions offer from Azure Marketplace." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-1.png":::

2. On the **Basics** tab, provide the required values. If applicable, you can use an existing Log Analytics workspace.

   :::image type="content" source="./media/azure-monitor-sap/azure-monitor-quickstart-2.png" alt-text="Screenshot that shows configuration options on the Basics tab." lightbox="./media/azure-monitor-sap/azure-monitor-quickstart-2.png":::

   When you're selecting a virtual network, ensure that the systems you want to monitor are reachable from within that virtual network. 

   > [!IMPORTANT]
   > Selecting **Share** for **Share data with Microsoft support** enables our support teams to help you with troubleshooting. This feature is available only for Azure Monitor for SAP solutions (Classic)



## Next steps

Learn more about Azure Monitor for SAP Solutions.

> [!div class="nextstepaction"]
> [Monitor SAP on Azure](monitor-sap-on-azure.md)
