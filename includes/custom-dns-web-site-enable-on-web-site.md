After the records for your domain name have propagated, you must associate them with your Web App. Use the following steps to enable the domain names using your web browser.

> [!NOTE]
> It can take some time for TXT records created in the previous steps to propagate through the DNS system. You cannot add the domain name of to your web app until the TXT record has propagated. If you are using an A record, you cannot add the A record domain name to your web app until the TXT record created in the previous step has propagated.
> 
> You can use a service such as <a href="http://www.digwebinterface.com/">http://www.digwebinterface.com/</a> to verify that the TXT record is available.
> 
> 

1. In your browser, open the [Azure Portal](https://portal.azure.com).
2. In the **Web Apps** tab, click the name of your web app, and then select **Custom domains**
   
    ![](./media/custom-dns-web-site/dncmntask-cname-6.png)
3. In the **Custom domains** blade, click **Add hostname**.
4. Use the **Hostname** text boxes to enter the domain names to associate with this web app.
   
    ![](./media/custom-dns-web-site/add-custom-domain.png)
5. Click **Validate**.
6. Upon clicking **Validate** Azure will kick off Domain Verification workflow. This will check for Domain ownership as well as Hostname availability and report success or detailed error with prescriptive guidence on how to fix the error.    

At this point, you should be able to enter the custom domain name in your browser and see that it successfully takes you to your web app.

