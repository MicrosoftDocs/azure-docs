Azure will determine the version of Python to use for its virtual environment with the following priority:

1. version specified in runtime.txt in the root folder
1. version specified by Python setting in the web app configuration (the **Settings** > **Application Settings** blade for your web app in the Azure Portal)
1. python-2.7 is the default if none of the above are specified

Valid values for the contents of 

    \runtime.txt

are:

- python-2.7
- python-3.4

If the micro version (third digit) is specified, it is ignored.
