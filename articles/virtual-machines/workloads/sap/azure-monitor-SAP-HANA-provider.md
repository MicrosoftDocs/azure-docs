# SAP HANA Provider

## Add SAP HANA Provider Steps (Using Portal UI):

1. Click on the **Providers** Tab in the AMS creation blade, then click on &quot; Add Provider&quot; button to go to the &quot; Add Provider&quot; Page

![image](https://user-images.githubusercontent.com/74435183/162337421-67c50f88-c5e8-4c5a-b9bc-ea0096b2827e.png)

2. Select Type as SAP HANA

![image](https://user-images.githubusercontent.com/98498799/171365559-80de91c9-601b-41e6-a91a-4ec9b28e0958.png)

3. IP address - Provide the IP address or hostname of the server running the SAP HANA instance to be monitored; when using a hostname, please ensure connectivity from within the Vnet.
4. Database tenant - Provide the HANA database to connect against (we strongly recommend using SYSTEMDB, since tenant databases don&#39;t have all monitoring views). Leave this field blank for legacy single-container HANA 1.0 instances.
5. Instance number - Provide the Instance number of the database [00-99], SQL port is automatically determined based on the instance number."
6. Database username - Provide the dedicated SAP HANA database user with the MONITORING role or BACKUP CATALOG READ role assigned (alternatively, use SYSTEM for non-production SAP HANA instances).
7. Database password - Provide the password corresponding to the database username, where you have two options on how to provide it:     
      a. Provide the password in the plain text.   
      b. Provide the password by selecting an existing or creating a new secret inside an Azure KeyVault.
