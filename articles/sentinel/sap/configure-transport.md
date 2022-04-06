---
title: Configure SAP Transport Management System | Microsoft Docs
description: This article shows you how to configure the SAP Transport Management System in the event of an error or in a lab environment where it hasn't already been configured, in order to successfully deploy the Continuous Threat Monitoring solution for SAP in Microsoft Sentinel.
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 04/07/2022
---
# Configure SAP Transport Management System

This article shows you how to configure the SAP Transport Management System in order to successfully deploy the Continuous Threat Monitoring solution for SAP in Microsoft Sentinel.

SAP's Transport Management System is normally already configured on production systems. However, in a lab environment, where CRs often haven't been previously installed, configuration may be required.

If you get this error running the **STMS_IMPORT** transaction while [preparing your SAP environment](preparing-sap.md), you'll need to configure the Transport Management System.

![Error while running STMS_IMPORT transaction](./media/preparing_sap/stms_import_error.png "Error while running STMS_IMPORT transaction")

The following steps are a sample on how to configure a transport management system.
> [!IMPORTANT] 
> In production systems always consult with SAP administrator on the steps to configure a transport management system
>
1. Run a new instance of SAP Logon and logon to Client number `000` as `DDIC` user<br>
![Logon to client 000 as DDIC account](./media/preparing_sap/ddic_logon.png "Logon to client 000 as DDIC account")
1. Run the **STMS** transaction<br>
<br>To run the transaction, type the name of the transaction **STMS** in the field in the top-left corner of the screen and press **Enter**
1. Delete existing TMS configuration
<br>In **Transport Management System** Delete the existing TMS Configuration
<br>To delete the TMS configuration, click on **More**, select **Extras** and select **Delete TMS Configuration**
<br>![Delete TMS configuration](./media/preparing_sap/remove_TMS_configuration.png "Delete TMS configuration")
<br>Confirm deletion of configuration by pressing **Yes**
<br>After deletion of the configuration, TMS transport domain needs to be configured.
<br>In the **TMS: Configure Transport Domain** press **Save**
<br>In the **Set Password for User TMSADM**, define a password complex password, make a note of the password in a secure location and click the green checkbox.
1. Configure Transport routes
<br>In **Transport Management System** click **Transport Routes**
<br>![Configure Transport Routes](./media/preparing_sap/tms_transport_routes.png "Configure Transport Routes")
<br>In **Change Transport Routes (Active)** click **Display <-> Change**
<br>![Display/Change Transport Routes](./media/preparing_sap/transport_routes_display_change.png "Display/Change Transport Routes")
<br>In **Change Transport Routes (Active)** click **More**, select **Configuration**, select **Standard Configuration**, select **Single System**
<br>![Change Transport Routes->More-Configuration->Standard Configuration->Single System](./media/preparing_sap/transport_routes_display_singlesystem.png "Change Transport <br>Routes->More-Configuration->Standard Configuration->Single System")
<br>In **Change Transport Routes (Revised)** click **Save**
<br>In **Configuration Short Text** window click **Save**
<br>In **Distribute and Activate** window click **Yes**
<br><br>
After steps above have been carried out, Transport management system will be configured and `STMS_IMPORT` transaction will work.
Close SAP GUI logged on to client `000` as `DDIC` and return to SAP GUI logged on to client `001`
</details>
-->



## Next steps

After the steps above are complete, the CRs required for Sentinel continuous protection for SAP operation are deployed, sample role is provisioned and a user account is created with necessary role profile assigned.
The next step is to deploy the data connector agent container.

> [!div class="nextstepaction"]
> [Deploy and configure the data connector agent container](deploy_data_connector_agent_container.md)

