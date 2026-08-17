Start-Process -FilePath (Get-ChildItem -Path 'C:\Users\User\Desktop\BleteFjale' -Filter '*.exe' | Sort-Object Length -Descending | Select-Object -First 1).FullName  
