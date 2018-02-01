In the local terminal window, add an Azure remote to your local Git repository. Replace _&lt;paste\_copied\_url\_here>_ with the URL of the Git remote that you saved from [Create a web app](#create).

```bash
git remote add azure <deploymentLocalGitUrl-from-create-step>
```

Push to the Azure remote to deploy your app with the following command. When prompted for a password, make sure that you enter the password you created in [Configure a deployment user](#configure-a-deployment-user), not the password you use to log in to the Azure portal.

```bash
git push azure master
```

This command may take a few minutes to run. While running, it displays information similar to the following example:
