1. In your browser, open the [Azure Marketplace image for Jenkins](https://azuremarketplace.microsoft.com/marketplace/apps/azure-oss.jenkins?tab=Overview).

1. Select **GET IT NOW**.

    ![Select GIT IT NOW to start the installation process for the Jenkins Marketplace image.](./media/jenkins-install-from-azure-marketplace-image/jenkins-install-get-it-now.png)

1. After reviewing the pricing details and terms information, select **Continue**.

    ![Jenkins Marketplace image pricing and terms information.](./media/jenkins-install-from-azure-marketplace-image/jenkins-install-pricing-and-terms.png)

1. Select **Create** to configure the Jenkins server in the Azure portal. 

    ![Install the Jenkins Marketplace image.](./media/jenkins-install-from-azure-marketplace-image/jenkins-install-create.png)

1. In the **Basics** tab, specify the following values:

    - **Name** - Enter `Jenkins`.
    - **User** - Enter the user name to use when signing into the virtual machine on which Jenkins is running.
    - **Authentication type** - Select **Password**.
    - **Password** - Enter the password to use when signing into the virtual machine on which Jenkins is running.
    - **Confirm password** - Reenter the password to use when signing into the virtual machine on which Jenkins is running.
    - **Jenkins release type** - Select **LTS**.
    - **Subscription** - Select the Azure subscription into which you want to install Jenkins.
    - **Resource group** - Select **Create new**, and enter a name for the resource group that server as a logical container for the collection of resources that make up your Jenkins installation.
    - **Location** - Select **East US**.

    ![Enter authentication and resource group information for Jenkins in the Basic tab.](./media/jenkins-install-from-azure-marketplace-image/jenkins-configure-basic.png)

1. Select **OK** to proceed to the **Settings** tab. 

1. In the **Settings** tab, specify the following values:

    - **Size** - Select the appropriate sizing option for your Jenkins virtual machine.
    - **VM disk type** - Specify either HDD (hard-disk drive) or SSD (solid-state drive) to indicate which storage disk type is allowed for the Jenkins virtual machine.
    - **Public IP address** - The IP address name defaults to the Jenkins name you specified in the previous page with a suffix of -IP. You can select the option to change that default.
    - **Domain name label** - Specify the value for the fully qualified URL to the Jenkins virtual machine.

    ![Enter virtual machine settings for Jenkins in the Settings tab.](./media/jenkins-install-from-azure-marketplace-image/jenkins-configure-settings.png)

1. Select **OK** to proceed to the **Summary** tab.

1. When the **Summary** tab displays, the information entered is validated. Once you see the **Validation passed** message, select **OK**. 

    ![The Summary tab displays and validates your selected options.](./media/jenkins-install-from-azure-marketplace-image/jenkins-configure-summary.png)

1. When the **Create** tab displays, select **Create** to create the Jenkins virtual machine. When your server is ready, a notification displays in the Azure portal.

    ![Jenkins is ready notification.](./media/jenkins-install-from-azure-marketplace-image/jenkins-install-notification.png)