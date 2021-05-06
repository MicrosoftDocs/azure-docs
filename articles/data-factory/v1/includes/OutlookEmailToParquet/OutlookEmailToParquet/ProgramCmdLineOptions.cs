namespace OutlookEmailToParquet
{
    partial class Program
    {
        public class ProgramCmdLineOptions
        {
            [CommandLine.Option("inboxfolder", Required = true, HelpText = "outlook folder bay rel to inbox. example: \"inbox/folder1\"")]
            public string OutlookInbox { get; set; }

            [CommandLine.Option("outputpath", Required = true, HelpText = "path to store the parquet files")]
            public string OutputPath { get; set; }

            [CommandLine.Option("outputprefix", Required = false, HelpText = "what to put at the start of the output files. Defaults to 'email'")]
            public string OutputPrefix { get; set; }



            [CommandLine.Option("datestart", Required = true, HelpText = "start date")]
            public string DateStart{ get; set; }

            [CommandLine.Option("dateend", Required = true, HelpText = "end date")]
            public string DateEnd { get; set; }



            [CommandLine.Option('v', "verbose", Required = false, HelpText = "Set output to verbose messages.")]
            public bool Verbose { get; set; }

            [CommandLine.Option("overwrite", Required = false, HelpText = "Overwrite existing files")]
            public bool Overwrite{ get; set; }

        }
    }
}
