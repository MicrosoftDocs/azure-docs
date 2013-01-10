To create a web site with the Windows Azure Command-Line Tools for Mac and Linux, run the following command from your local applicaton directory, replacing `[site name]` with the name of your web site:

	azure site create [site name]

The default URL for your web site will have the following format:

	[site name].azurewebsites.net

Note that you can execute the `azure site create` command with any of the following options:

* `--location [location name]`
* `--hostname [custom host name]`
* `--git`