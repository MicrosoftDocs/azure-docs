using System;
using System.Collections.Generic;
using Outlook = Microsoft.Office.Interop.Outlook;
// https://docs.microsoft.com/en-us/office/client-developer/outlook/pia/how-to-get-a-default-folder-and-enumerate-its-subfolders
// https://docs.microsoft.com/en-us/visualstudio/vsto/working-with-folders?view=vs-2019
// https://github.com/aloneguid/parquet-dotnet
// https://github.com/dougmsft/microsoft-avro


//https://docs.microsoft.com/en-us/office/vba/outlook/How-to/Search-and-Filter/filtering-items-using-a-date-time-comparison


namespace OutlookEmailToParquet
{
    public static class Helpers
    {

        public static DateTime GetFirstDayInMonth(System.DateTime dt)
        {
            return new System.DateTime(dt.Year, dt.Month, 1);
        }

        public static DateTime GetFirstFayInMonth(int year, int month)
        {
            var dt = new System.DateTime(year, month, 1);
            return dt;
        }

        public static DateTime GetLastDayInMonth(System.DateTime dt)
        {
            var dt2 = GetFirstDayInMonth(dt);
            var dt3 = dt2.AddMonths(1).AddDays(-1);
            return dt3;
        }

        public static DateTime GetLastDayInMonth(int year, int month)
        {
            var dt = new System.DateTime(year, month, 1);
            return GetFirstDayInMonth(dt);
        }

        public static IEnumerable<System.DateTime> GetMonthsInRange(System.DateTime dt_start, System.DateTime dt_end)
        {
            var dt_start_x = GetFirstDayInMonth(dt_start);
            var dt_end_x = GetLastDayInMonth(dt_end);

            var dt = dt_start_x;
            while (dt < dt_end_x)
            {
                yield return dt;
                dt = dt.AddMonths(1);
            }

        }

        public static Outlook.MAPIFolder NavigateToFolder(Outlook.Application app, string folder_path)
        {
            var root_folder = app.Session.GetDefaultFolder(
                Outlook.OlDefaultFolders.olFolderInbox);

            folder_path = folder_path.TrimStart('/');
            folder_path = folder_path.TrimEnd('/');

            var path_comps = folder_path.Split('/');

            Outlook.MAPIFolder folder = root_folder;

            // navigate into each folder
            foreach (var comp in path_comps)
            {
                folder = folder.Folders[comp];
            }

            return folder;
        }


    }
}
