

Navigate to your virtual machine (for example, http://jenkins2517454.eastus.cloudapp.azure.com/) in  your web browser. The Jenkins console is inaccessible through unsecured HTTP so instructions are provided on the page to access the Jenkins console securely from your computer using an SSH tunnel.

![Unlock jenkins](./media/jenkins-install-from-azure-marketplace-image/jenkins-ssh-instructions.png)

Set up the tunnel using the `ssh` command on the page from the command line, replacing `username` with the name of the virtual machine admin user chosen earlier when setting up the virtual machine from the solution template.

```bash
ssh -L 127.0.0.1:8080:localhost:8080 jenkinsadmin@jenkins2517454.eastus.cloudapp.azure.com
```

After you have started the tunnel, navigate to http://localhost:8080/ on your local machine. 

Get the initial password by running the following command in the command line while connected through SSH to the Jenkins VM.

```bash
`sudo cat /var/lib/jenkins/secrets/initialAdminPassword`.
```

Unlock the Jenkins dashboard for the first time using this initial password.

![Unlock jenkins](./media/jenkins-install-from-azure-marketplace-image/jenkins-unlock.png)

Select **Install suggested plugins** on the next page and then create a Jenkins admin user used to access the Jenkins dashboard.

![Jenkins is ready!](./media/jenkins-install-from-azure-marketplace-image/jenkins-welcome.png)

The Jenkins server is now ready to build code.