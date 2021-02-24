Deploying the Metadata Extraction ABAP Function Module for the SAP R3 Family of Bridges 
=======================================================================================

Overview 
--------

The SAP Business Suite 4 HANA (S/4HANA), ECC, R/3 ERP bridge may be used
to extract metadata from the SAP Data Dictionary. It does so by making
use of an ABAP function module that one places on the SAP server. This
function module is remotely accessible by the bridge to query and
download (as a text file) the metadata containing within the SAP server.
When executed, the bridge then either:

1.  Import metadata from an existing file already downloaded locally
    from a previous bridge execution.

2.  Invoke the ABAP module API, wait for the download, and then import
    metadata from that file.

This document details the steps required to deploy this module.

Note: The following instructions were compiled based on the SAP GUI
v.7.2

Deployment of the Module 
------------------------

### Create a Package 

This step is optional, and an existing package can be used.

1.  Login to the SAP S/4HANA or SAP ECC server and open \"Object
    Navigator\" (SE80 transaction).

2.  Select option \"Package\" from the list and enter a name for the new
    package (e.g. Z\_MITI) then press button 'Display'

3.  Press 'Yes' in the 'Create Package' window. Consequently, a window
    \"Package Builder: Create Package\" will be opened. Enter value into
    'Short Description' field and press the \"Continue\" icon.

4.  Press 'Own Requests' in the 'Prompt for local Workbench request'
    window. Select 'development' request.

### Create a Function Group 

In Object Navigator select \"Function Group\" from the list and type its
name in the input field below (e.g. Z\_MITI\_FGROUP). Press View icon.

1.  In \"Create Object\" window press yes to create a new function
    group.

2.  Specify an appropriate description in the \"Short text\" field and
    press button \"Save\".

3.  Choose a package which was prepared on the previous stage \"Create a
    Package\" and click on icon \"Save\".

4.  Confirm a request by pressing icon \"Continue\".

5.  Activate this Function Group.

### Create the ABAP Function Module 

After the function group was created and selected, right click on its
name in repository browser and select \"Create=\>Function Module\".

Enter \"Z\_MITI\_DOWNLOAD\" into \"Function Module\" field and populate
\"Short text\" input with proper description.

When the module has been created, specify the following information:

1.  Navigate to the \"Attributes\" tab.

2.  Select Processing Type = Remote-Enabled Function Module.

> ![](my_media_files/media/image1.png){width="5.92in"
> height="3.3082895888014in"}

3.  Navigate to the \"Source code\" tab. There are two ways how to
    deploy code for the function:

    a.  From the main menu, upload Z\_MITI\_DOWNLOAD.txt file by
        selecting Utilities=\>More Utilities=\>Upload/Download=\>Upload.

    b.  Alternatively, open the file, copy its content and paste into
        \"Source code\" area.

4.  Navigate to the \"Import\" tab and create the following parameters:

    a.  P\_AREA TYPE DD02L-TABNAME (Optional = True)

    b.  *P\_LOCAL\_PATH TYPE STRING* (Optional = True)

    c.  *P\_LANGUAGE TYPE L001TAB-DATA DEFAULT \'E\'*

    d.  *ROWSKIPS TYPE SO\_INT DEFAULT 0*

    e.  *ROWCOUNT TYPE SO\_INT DEFAULT 0*

> Note: Choose \"Pass Value\" for all of them:
>
> ![](my_media_files/media/image2.png){width="5.895999562554681in"
> height="1.9258661417322835in"}

5.  Navigate to the "Tables" tab and define the following:

*EXPORT\_TABLE LIKE TAB512*

![](my_media_files/media/image3.png){width="6.01824365704287in"
height="1.6240004374453194in"}

6.  Navigate to the \"Exceptions\" tab and define the following
    exception:

*E\_EXP\_GUI\_DOWNLOADFAILED*

![](my_media_files/media/image4.png){width="5.783999343832021in"
height="1.8959372265966754in"}

7.  Save the function (press ctrl+S or choose Function Module=\>Save in
    the main menu).

8.  Click \"Activate\" icon on the toolbar (ctrl+F3) and press
    \"Continue\" button in dialog window. If prompted, you should select
    the generated includes to be activated along with the main function
    module.

### Testing the Function 

When all the previous steps are completed, follow the below steps to
test the function:

1.  Open Z\_MITI\_DOWNLOAD function module.

2.  Choose \"Function Module=\>Test=\>Test Function Module\" from the
    main menu (or press F8).

3.  Enter a path to the folder on the local file system into parameter
    P\_LOCAL\_PATH and press \"Execute\" icon on the toolbar (or press
    F8).

4.  Put the name of the area of interest into P\_AREA field if a file
    with metadata must be downloaded or updated. When the function
    finishes working, the folder which has been indicated in
    P\_LOCAL\_PATH parameter must contain several files with metadata
    inside. The names of files mimic areas which can be specified in
    P\_AREA field.

The function will finish its execution and metadata will be downloaded
much faster in case of launching it on the machine which has high-speed
network connection with SAP S/4HANA or ECC server.
