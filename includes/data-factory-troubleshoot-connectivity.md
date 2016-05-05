## Troubleshoot connectivity issues
Use the **Diagnostics** tab of **Data Management Gateway Configuration Manager** to troubleshoot connection issues. 

1. Launch **Data Management Gateway Configuration Manager**. You can either run "C:\Program Files\Microsoft Data Management Gateway\1.0\Shared\ConfigManager.exe" directly (or) search for **Gateway** to find a link to **Microsoft Data Management Gateway** application as shown in the following image. 

	![Search gateway](./media/data-factory-troubleshoot-connectivity/search-gateway.png)
2. Switch to the **Diagnostics** tab.

	![Gateway diagnostics](./media/data-factory-troubleshoot-connectivity/data-factory-gateway-diagnostics.png) 
3. Select the **type** of data store (linked service). 
4. Specify **authentication** and enter **credentials** (or) enter **connection string** to connect to the data store. 
5. Click **Test connection** to test the connection to the data store. 