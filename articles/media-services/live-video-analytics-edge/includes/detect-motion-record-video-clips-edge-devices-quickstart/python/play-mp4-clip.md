The MP4 files are written to a directory on the edge device that you configured in the *.env* file by using the OUTPUT_VIDEO_FOLDER_ON_DEVICE key. If you used the default value, then the results should be in the */var/media/* folder.

To play the MP4 clip:

1. Go to your resource group, find the VM, and then connect by using Azure Bastion.

    ![Resource group](../../../media/quickstarts/resource-group.png)
    
    ![VM](../../../media/quickstarts/virtual-machine.png)
1. Sign in by using the credentials that were generated when you [set up your Azure resources](../../../detect-motion-emit-events-quickstart.md#set-up-azure-resources). 
1. At the command prompt, go to the relevant directory. The default location is */var/media*. You should see the MP4 files in the directory.

    ![Output](../../../media/quickstarts/samples-output.png) 

1. Use [Secure Copy (SCP)](../../../../../virtual-machines/linux/copy-files-to-linux-vm-using-scp.md) to copy the files to your local machine. 
1. Play the files by using [VLC media player](https://www.videolan.org/vlc/) or any other MP4 player.
