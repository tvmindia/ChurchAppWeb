﻿$("document").ready(function (e) {
    BindAsyncAdminsTable();
    //--------------- *Save MassTiming* ----------------//
    $(".AddMass").click(function (e) {
        debugger;
        var saveOrEdit = $("#AddorEditSpan").text();
        if (saveOrEdit == "Save")
        {
            var result = "";
            var churchId = '41f453f6-62a4-4f80-8fc5-1124e6074287';
            var day = $("#txtDay").val();
            var time = Date();
            var MassTimings = new Object();
            MassTimings.massChurchId = churchId;
            MassTimings.day = day;
            MassTimings.massTime = time;
            result = InsertMassTiming(MassTimings);
            if (result == "1") {
                alert("Success");
            }
            else {
                alert("Failure");
            }
        }
        else
        {
            var result = "";
            var churchId = $("#hdfChurchID").val();
            var massId = $("#hdfMassID").val();
            var day = $("#txtDay").val();
            var time = $("#txtTime").val();
            var MassTimings = new Object();
            MassTimings.massChurchId = churchId;
            MassTimings.day = day;
            MassTimings.massTime = time;
            MassTimings.massTimingID = massId;
            result = UpdateMassTiming(MassTimings);
            if (result == "1") {
                alert("Success");
            }
            else {
                alert("Failure");
            }
        }
        
    });

    $(".massTimeEdit").click(function (e) {
        debugger;
        $("#AddorEditSpan").text("Edit");
        var jsonResult = {};
        editedrow = $(this).closest('tr');
        var MassID = editedrow.attr("ID");
        var churchId = '41f453f6-62a4-4f80-8fc5-1124e6074287';
        var MassTimings = new Object();
        MassTimings.massChurchId = churchId;
        MassTimings.massTimingID = MassID;
        jsonResult = selectMassTimeByMassID(MassTimings);
        if (jsonResult != undefined)
        {
            BindMassScheduleTextBoxes(jsonResult);
           
        }
    });
    $(".massTimeDelete").click(function (e) {
        debugger;
        var result = "";
        editedrow = $(this).closest('tr');
        var MassID = editedrow.attr("ID");
        var massChurchID = editedrow.attr("ChurchID");
        result = DeleteMassTime(MassTimings);
        if (result == "1") {
            alert("Success");
        }
        else {
            alert("Failure");
        }
        });
});//end of document.ready

//----------Insert MassTiming--------------//
function DeleteMassTime(MassTimings)
{
    debugger;
    var data = "{'MassTimingsObj':" + JSON.stringify(MassTimings) + "}";
    jsonResult = getJsonData(data, "../AdminPanel/MassSchedules.aspx/DeleteMassTiming");
    var table = {};
    table = JSON.parse(jsonResult.d);
    return table;
}
function BindMassScheduleTextBoxes(jsonResult)
{
    debugger;
    var day = jsonResult[0]["Day"];
    var churchId = jsonResult[0]["ChurchID"];
    var massId = jsonResult[0]["ID"];
    var time = jsonResult[0]["Time"];
    var massTime = ConvertJsonTime(time);
    massTime = massTime.split(" ")[1];
    $("#hdfChurchID").val(churchId);
    $("#hdfMassID").val(massId);
    $("#txtDay").val(day);
    $("#txtTime").val(massTime);
}
function InsertMassTiming(MassTimings) {
    debugger;
    var data = "{'MassTimingsObj':" + JSON.stringify(MassTimings) + "}";
    jsonResult = getJsonData(data, "../AdminPanel/MassSchedules.aspx/InsertMassTiming");
    var table = {};
    table = JSON.parse(jsonResult.d);
    return table;
}
function UpdateMassTiming(MassTimings)
{
    debugger;
    var data = "{'MassTimingsObj':" + JSON.stringify(MassTimings) + "}";
    jsonResult = getJsonData(data, "../AdminPanel/MassSchedules.aspx/UpdateMassTiming");
    var table = {};
    table = JSON.parse(jsonResult.d);
    return table;
}
function BindMassTimingTable(Records) {

    debugger;
    $("tbody#massTimingTableBody tr").remove();

    $.each(Records, function (index, Records) {
        var finalDate= ConvertJsonTime(Records.Time);
        finalDate = finalDate.split(" ")[1];
        var html = '<tr class="MassTimingRows" ID="' + Records.ID + '"ChurchID="' + Records.ChurchID + '"><td>' + Records.Day + '</td><td class="center">' + finalDate + '</td></td><td class="center"><a class="circlebtn circlebtn-info massTimeEdit" title="Edit" href="#"><i class="halflings-icon white edit"></i></a><a class="circlebtn circlebtn-danger massTimeDelete" title="Delete" href="#"><i class="halflings-icon white trash"></i> </a></td></tr>';
        $("#massTimingTable").append(html);
    })
}
function BindAsyncAdminsTable() {
    debugger;
    var churchId = '41f453f6-62a4-4f80-8fc5-1124e6074287';
        var jsonResult = {};
        var MassTimings = new Object();
        MassTimings.massChurchId = churchId;
        jsonResult = GetAllMassTimings(MassTimings);
        if (jsonResult != undefined) {
            BindMassTimingTable(jsonResult);
        }
    
}
function selectMassTimeByMassID(MassTimings)
{
    debugger;
    var ds = {};
    var table = {};
    var data = "{'MassTimingsObj':" + JSON.stringify(MassTimings) + "}";
    ds = getJsonData(data, "../AdminPanel/MassSchedules.aspx/selectMassTimeByMassID");
    table = JSON.parse(ds.d);
    return table;
}

function GetAllMassTimings(MassTimings)
{
    var ds = {};
    var table = {};
        var data = "{'MassTimingsObj':" + JSON.stringify(MassTimings) + "}";
        ds = getJsonData(data, "../AdminPanel/MassSchedules.aspx/GetAllMassTimings");
        table = JSON.parse(ds.d);
    return table;
}

function ConvertJsonTime(TimeToConvert)
{
    var str, year, month, day, hour, minute, d, finalDate;

    str = TimeToConvert.replace(/\D/g, "");
    d = new Date(parseInt(str));

    year = d.getFullYear();
    month = pad(d.getMonth() + 1);
    day = pad(d.getDate());
    hour = pad(d.getHours());
    minutes = pad(d.getMinutes());

    finalDate = year + "-" + month + "-" + day + " " + hour + ":" + minutes;

    function pad(num) {
        num = "0" + num;
        return num.slice(-2);
    }
    return finalDate;
}
