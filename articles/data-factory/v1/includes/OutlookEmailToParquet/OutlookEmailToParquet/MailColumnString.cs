// htt

using System.Collections.Generic;

namespace OutlookEmailToParquet
{
    public class MailColumnString : MailColumnTyped<string>
    {
        public MailColumnString(string name) : base(name)
        {
        }


        public override Parquet.Data.DataColumn ToParquetColumn()
        {
            var col_x = new Parquet.Data.DataColumn(new Parquet.Data.DataField<string>(this.Name), this.ToSystemArray());
            return col_x;
        }
    }

    public class MailColumnStringArray : MailColumnTyped<string[]>
    {
        public MailColumnStringArray(string name) : base(name)
        {
        }

        public override Parquet.Data.DataColumn ToParquetColumn()
        {
            var field = new Parquet.Data.DataField<IEnumerable<string>>(this.Name);

            var list_values = new List<string>();
            var list_replevels = new List<int>();

            foreach (string [] string_array in this.Values)
            {
                if (string_array==null)
                {
                    list_values.Add(null);
                    list_replevels.Add(0);
                }
                else
                {
                    if (string_array.Length<1)
                    {
                        list_values.Add(null);
                        list_replevels.Add(0);
                    }
                    else
                    {
                        for (int i=0; i<string_array.Length;i++)
                        {
                            list_values.Add(string_array[i]);
                            if (i==0) { list_replevels.Add(0);  }
                            else { list_replevels.Add(1); }
                        }
                    }
                }
            }

            System.Array array = list_values.ToArray();
            int[] replevels = list_replevels.ToArray();

            var col_x = new Parquet.Data.DataColumn(field, array, replevels);
            return col_x;
        }
    }
}
