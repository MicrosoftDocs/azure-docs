Switch back to the browser window which contains the Azure portal.

#### Add Hostname

Click the **+** icon next to **Add hostname**.

![Add host name](./media/app-service-web-tutorial-custom-domain/add-host-name-cname.png)

#### Validate Hostname

Type the fully qualified domain name for which you configured the CNAME record earlier (e.g. `www.contoso.com`), then click **Validate**.

Select **CNAME (www.example.com or any subdomain)** option under the **Hostname record type** header.

Click **Add hostname** to add the DNS name to your app.

![Add DNS name to the app](./media/app-service-web-tutorial-custom-domain/validate-domain-name-cname.png)

It might take some time for the new hostname to be reflected in your app's **Custom domains** page. Try refreshing the browser to update the data.