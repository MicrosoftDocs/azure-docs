## Push to Azure from Git

Add an Azure remote to your local Git repository.

```bash
git remote add azure <URI from previous step>
```

Push to the Azure remote to deploy your app. You are prompted for the password you created earlier when you created the deployment user. Make sure that you enter the password you created in [Configure a deployment user](#configure-a-deployment-user), not the password you use to log in to the Azure portal.

```bash
git push azure master
```

The preceding command displays information similar to the following example:
