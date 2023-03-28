var apiUrl; // declare apiUrl globally
var dataTable = $("#dtHorizontalVerticalExample").DataTable({
  scrollX: true,
  scrollY: 400,
  columnDefs: [
    {
      targets: [0],
      orderable: false,
    },
  ],
});
$(document).ready(function () {
  apiUrl = "http://ec2-3-110-30-86.ap-south-1.compute.amazonaws.com:8000/";
  $("#UploadDocModalTitle").text("Add Doc");
  $("#UploadDocModalType").val("Add");
  getEquipments();
});

function getEquipments() {
  $.ajax({
    url: apiUrl + "equipments/",
    type: "GET",
    success: function (data) {
      if ($.fn.DataTable.isDataTable("#dtHorizontalVerticalExample")) {
        dataTable.destroy();
      }
      var table = $("#dtHorizontalVerticalExample");

      if (data) {
        var tbody = table.find("tbody");
        tbody.empty(); // clear existing table body content
        $.each(data, function (index, equipment) {
          var row = $("<tr>");
          // row.attr("onclick", "getEquipmentsDetails(" + equipment.id + ")");
          row.append(
            $(
              `<td><div class="btn-group">
                <button type="button" class="btn btn-outline-primary" onClick='editEquipmentModalShow(` +
                equipment.id +
                `)'>
                  <i class="fa fa-edit"></i>
                </button>
                <button type="button" class="btn btn-outline-danger ml-2" onClick='deleteEquipmentModalShow(` +
                equipment.id +
                `)'>
                  <i class="fa fa-trash"></i>
                </button>
              </div></td>`
            )
          );
          row.append(
            $("<td onclick=getEquipmentsDetails(" + equipment.id + ")>").text(
              equipment.manufacturer
            )
          );
          row.append(
            $("<td onclick=getEquipmentsDetails(" + equipment.id + ")>").text(
              equipment.model
            )
          );
          row.append(
            $("<td onclick=getEquipmentsDetails(" + equipment.id + ")>").text(
              equipment.version
            )
          );
          row.append(
            $(
              "<td onclick=getEquipmentsDetails(" +
                equipment.id +
                ") class='rowdescription'>"
            ).text(equipment.equipment_description)
          );
          row.append(
            $(
              "<td onclick=getEquipmentsDetails(" +
                equipment.id +
                ") class='specialinstructiontext'>"
            ).text(equipment.special_instructions)
          );

          row.append(
            $("<td onclick=getEquipmentsDetails(" + equipment.id + ")>").text(
              equipment.software_rev
            )
          );
          row.append(
            $("<td onclick=getEquipmentsDetails(" + equipment.id + ")>").text(
              equipment.firmware_rev
            )
          );
          row.append(
            $("<td onclick=getEquipmentsDetails(" + equipment.id + ")>").text(
              equipment.utility_software
            )
          );
          row.append(
            $("<td onclick=getEquipmentsDetails(" + equipment.id + ")>").text(
              equipment.useful_life
            )
          );
          row.append(
            $("<td onclick=getEquipmentsDetails(" + equipment.id + ")>").text(
              equipment.obsolescence_date
            )
          );
          row.append(
            $("<td onclick=getEquipmentsDetails(" + equipment.id + ")>").text(
              equipment.status
            )
          );

          row.append(
            $("<td onclick=getEquipmentsDetails(" + equipment.id + ")>").text(
              equipment.date_approved
            )
          );
          row.append(
            $("<td onclick=getEquipmentsDetails(" + equipment.id + ")>").text(
              equipment.area_approval
            )
          );
          row.append(
            $("<td onclick=getEquipmentsDetails(" + equipment.id + ")>").text(
              equipment.approved_by
            )
          );
          row.append(
            $(
              "<td> <a href='" +
                equipment.documents_link +
                "'>" +
                equipment.documents_name +
                "</a>"
            )
          );

          tbody.append(row);
        });
      }

      dataTable = $("#dtHorizontalVerticalExample").DataTable({
        scrollX: true,
        scrollY: 400,
        columnDefs: [
          {
            targets: [0],
            orderable: false,
          },
        ],
      });

      $(".dataTables_length").addClass("bs-select");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  });
}

function closeUploadDocModal() {
  var form = document.querySelector("#UploadDocModalform");
  form.reset();
  $("#UploadDocModalTitle").text("Add Doc");
  $("#UploadDocModalType").val("Add");
  $("#UploadDocModal").modal("hide");
  $("#addmoresubmitmessage").hide();
  getEquipments();
}

function closeEquipmentdetailmodal() {
  var form = document.querySelector("#Equipmentdetailform");
  form.reset();
  $("#Equipmentdetailmodal").modal("hide");
}

function closedeleteEquipmentdetailmodal() {
  $("#confirm-delete").modal("hide");
}

function deleteEquipmentModalShow(id) {
  $("#confirm-delete").modal("show");
  $("#deleteEquipmentId").val(id);
}

function editEquipmentModalShow(id) {
  $("#editEquipmentId").val(id);
  $("#UploadDocModalTitle").text("Update Doc");
  $("#UploadDocModalType").val("Update");

  $.ajax({
    url: apiUrl + "equipments/" + id,
    type: "GET",
    success: function (data, textStatus, xhr) {
      if (xhr.status === 200) {
        $("#manufacturer").val(data.manufacturer);
        $("#model").val(data.model);
        $("#versionoptions").val(data.version);
        $("#equipdescription").val(data.equipment_description);
        $("#specialinstructions").val(data.special_instructions);
        $("#softwarerev").val(data.software_rev);
        $("#firmwarerev").val(data.firmware_rev);
        $("#utilitysoftwarerev").val(data.utility_software);
        $("#usefullife").val(data.useful_life);
        $("#obsolescencedate").val(data.obsolescence_date);
        $("#status").val(data.status);
        $("#dateapproved").val(data.date_approved);
        $("#areaapproval").val(data.area_approval);
        $("#approvedby").val(data.approved_by);
        $("#documentname").val(data.documents_name);
        $("#documentlink").val(data.documents_link);
        $("#UploadDocModal").modal("show");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    },
  });
}

function deleteEquipment() {
  var id = $("#deleteEquipmentId").val();
  if (id) {
    $.ajax({
      url: apiUrl + "equipments/" + id,
      type: "DELETE",
      crossDomain: true,
      success: function (result) {
        // Handle success response
        toastr.success("Equipment deleted successfully.");
        $("#confirm-delete").modal("hide");
        getEquipments();
      },
      error: function (xhr, status, error) {
        // Handle error response
        var errorMessage = "Error occurred.";
        if (xhr.status === 404) {
          errorMessage = "Equipment not found.";
        } else if (xhr.status === 401) {
          errorMessage = "Unauthorized access.";
        } else if (xhr.status === 500) {
          errorMessage = "Internal server error.";
        }
        console.log(errorMessage);
        toastr.error(errorMessage);
      },
    });
  } else {
    $("#confirm-delete").modal("hide");
    getEquipments();
  }
}

function AddorUpdateDoc() {
  if (validateForm("UploadDocModalform")) {
    $("#validationmessage").hide();
    $("#addmoresubmitmessage").hide();
    var obj = {
      manufacturer: $("#manufacturer").val(),
      model: $("#model").val(),
      version: $("#versionoptions").val(),
      equipment_description: $("#equipdescription").val(),
      special_instructions: $("#specialinstructions").val(),
      software_rev:
        $("#softwarerev").val() == "null" ? null : $("#softwarerev").val(),
      firmware_rev: $("#firmwarerev").val(),
      utility_software: $("#utilitysoftwarerev").val(),
      useful_life: $("#usefullife").val(),
      obsolescence_date: $("#oobsolescencedate").val(),
      status: $("#status").val() == "null" ? null : $("#status").val(),
      date_approved: $("#dateapproved").val(),
      area_approval:
        $("#areaapproval").val() == "null" ? null : $("#areaapproval").val(),
      approved_by: $("#approvedby").val(),
      documents_name: $("#documentname").val(),
      documents_link: $("#documentlink").val(),
    };
    var getType = $("#UploadDocModalType").val();
    if (getType == "Add") {
      $.ajax({
        url: apiUrl + "equipments/",
        method: "POST",
        data: obj,
        success: function (response) {
          $("#addmoresubmitmessage").show();
          toastr.success("Equipment added successfully");
          var form = document.querySelector("#UploadDocModalform");
          form.reset();
          $("#UploadDocModalTitle").text("Add Doc");
          $("#UploadDocModalType").val("Add");
          getEquipments();
        },
        error: function (xhr, status, error) {
          if (xhr.status === 400) {
            toastr.error("Bad Request: " + xhr.responseJSON.message);
          } else if (xhr.status === 401) {
            toastr.error("Unauthorized: " + xhr.responseJSON.message);
          } else if (xhr.status === 404) {
            toastr.error("Not Found: " + xhr.responseJSON.message);
          } else {
            toastr.error("Error: " + error);
          }
        },
      });
    } else if (getType == "Update") {
      var editEquipmentId = $("#editEquipmentId").val();
      $.ajax({
        url: apiUrl + "equipments/" + editEquipmentId + "/",
        method: "PUT",
        data: obj,
        success: function (response) {
          toastr.success("Equipment Updated successfully");
          closeUploadDocModal();
        },
        error: function (xhr, status, error) {
          if (xhr.status === 400) {
            toastr.error("Bad Request: " + xhr.responseJSON.message);
          } else if (xhr.status === 401) {
            toastr.error("Unauthorized: " + xhr.responseJSON.message);
          } else if (xhr.status === 404) {
            toastr.error("Not Found: " + xhr.responseJSON.message);
          } else {
            toastr.error("Error: " + error);
          }
        },
      });
    }
  }
}

function validateForm(formId) {
  var form = document.getElementById(formId);
  var requiredFields = form.querySelectorAll(
    "input[required], textarea[required]"
  );

  for (var i = 0; i < requiredFields.length; i++) {
    if (requiredFields[i].value.trim() === "") {
      toastr.error("Please fill out all required fields.");
      $("#addmoresubmitmessage").hide();
      $("#validationmessage").show();
      return false;
    }
  }

  if (formId == "UploadDocModalform") {
    const url = $("#documentlink").val().trim();
    if (url != null && url != undefined && url != "") {
      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        toastr.error("Please enter a valid URL");
        return false;
      }
    } else {
      $("#validationmessage").hide();
      return true;
    }
  }
  $("#validationmessage").hide();
  return true;
}

function getEquipmentsDetails(id) {
  if (id) {
    $.ajax({
      url: apiUrl + "equipment-details/" + id,
      type: "GET",
      success: function (data) {
        if (data) {
          $("#applicationrestrictions").val(data.application_restriction);
          var isChecked = data.hazardous_area_classification_met;
          if (isChecked) {
            $("#classificationmet_yes").prop("checked", true);
          } else if (isChecked != undefined) {
            $("#classificationmet_no").prop("checked", true);
          }

          var isChecked1 = data.manufactural_quality_good;
          if (isChecked1) {
            $("#manufacturerquality_yes").prop("checked", true);
          } else if (isChecked1 != undefined) {
            $("#manufacturerquality_no").prop("checked", true);
          }

          var isChecked2 = data.installation_match_manufacturer_recommendations;
          if (isChecked2) {
            $("#manufacturerrecommendations_yes").prop("checked", true);
          } else if (isChecked2 != undefined) {
            $("#manufacturerrecommendations_no").prop("checked", true);
          }

          var isChecked3 =
            data.maintainance_plan_agree_with_manufacturer_recommendations;
          if (isChecked3) {
            $("#maintenanceplan_yes").prop("checked", true);
          } else if (isChecked3 != undefined) {
            $("#maintenanceplan_no").prop("checked", true);
          }

          $("#otherapprovals").val(data.other_approvals);
          $("#manufacturerrecommendationsno").val(
            data.installation_match_manufacturer_recommendations_if_no
          );

          $("#maintenanceplanno").val(
            data.maintainance_plan_agree_with_manufacturer_recommendations_if_no
          );
          $("#special_instructions").val(data.special_instructions);
          $("#approvaltext").val(data.approval_based_on);
          $("#prioruseinapp").val(data.prior_use_application);
          $("#asofdate").val(data.as_of_date);
          $("#obsolescencestatus").val(data.obsolescence_status);
          $("#obsolescence_date").val(data.obsolescence_date);
          $("#usefullifeyr").val(data.useful_life);
          $("#comments").val(data.comments);
          $("#recommendations").val(data.recommendations);
          $("#ereviewedby").val(data.reviewed_by);
          $("#erevieweddate").val(data.reviewed_date);

          var isChecked4 = data.close_record;
          if (isChecked4) {
            $("#closerecord_yes").prop("checked", true);
          }
          $("#EquipmentdetailmodalId").val(data.id);
          $("#EquipmentdetailmodalType").val("Update");
          $("#Equipmentdetailmodal").modal("show");
        }
        console.log(data);
      },
      error: function (jqXHR, Status, errorThrown) {
        if (jqXHR.status == 404 && errorThrown == "Not Found") {
          $("#EquipmentdetailmodalType").val("Add");
          $("#EquipmentdetailmodalId").val(id);
          $("#Equipmentdetailmodal").modal("show");
        }
      },
    });
  }
}

function saveEquipmentDetails() {
  var obj = {
    id:
      $("#EquipmentdetailmodalId").val() == 0
        ? null
        : $("#EquipmentdetailmodalId").val(),
    application_restriction: $("#applicationrestrictions").val(),
    hazardous_area_classification_met:
      $("input[name=classificationmet]:checked").val() == undefined
        ? null
        : $("input[name=classificationmet]:checked").val(),
    other_approvals: $("#otherapprovals").val(),
    manufactural_quality_good:
      $("input[name=manufacturerquality]:checked").val() == undefined
        ? null
        : $("input[name=manufacturerquality]:checked").val(),
    installation_match_manufacturer_recommendations:
      $("input[name=manufacturerrecommendations]:checked").val() == undefined
        ? null
        : $("input[name=manufacturerrecommendations]:checked").val(),
    installation_match_manufacturer_recommendations_if_no: $(
      "#manufacturerrecommendationsno"
    ).val(),
    maintainance_plan_agree_with_manufacturer_recommendations:
      $("input[name=maintenanceplan]:checked").val() == undefined
        ? null
        : $("input[name=maintenanceplan]:checked").val(),
    maintainance_plan_agree_with_manufacturer_recommendations_if_no:
      $("#maintenanceplanno").val(),
    special_instructions: $("#special_instructions").val(),
    approval_based_on: $("#approvaltext").val(),
    prior_use_application: $("#prioruseinapp").val(),
    as_of_date: $("#asofdate").val(),
    obsolescence_status:
      $("#obsolescencestatus").val() == "null"
        ? null
        : $("#obsolescencestatus").val(),
    obsolescence_date: $("#obsolescence_date").val(),
    useful_life: $("#usefullifeyr").val(),
    comments: $("#comments").val(),
    recommendations: $("#recommendations").val(),
    reviewed_by: $("#ereviewedby").val(),
    reviewed_date: $("#erevieweddate").val(),
    close_record:
      $("input[name=closerecord]:checked").val() == undefined
        ? null
        : $("input[name=closerecord]:checked").val(),
  };

  // var obj = {
  //   id:
  //     $("#EquipmentdetailmodalId").val() == 0
  //       ? null
  //       : $("#EquipmentdetailmodalId").val(),
  //   application_restriction: $("#applicationrestrictions").val(),
  //   hazardous_area_classification_met: $(
  //     "input[name=classificationmet]:checked"
  //   ).val(),
  //   other_approvals: $("#otherapprovals").val(),
  //   manufactural_quality_good: $(
  //     "input[name=manufacturerquality]:checked"
  //   ).val(),
  //   installation_match_manufacturer_recommendations: $(
  //     "input[name=manufacturerrecommendations]:checked"
  //   ).val(),
  //   installation_match_manufacturer_recommendations_if_no: $(
  //     "#manufacturerrecommendationsno"
  //   ).val(),
  //   maintainance_plan_agree_with_manufacturer_recommendations: $(
  //     "input[name=maintenanceplan]:checked"
  //   ).val(),
  //   maintainance_plan_agree_with_manufacturer_recommendations_if_no: false,
  //   special_instructions: $("#special_instructions").val(),
  //   approval_based_on: $("#approvaltext").val(),
  //   prior_use_application: $("#prioruseinapp").val(),
  //   as_of_date: $("#asofdate").val(),
  //   obsolescence_status: $("#obsolescencestatus").val(),
  //   obsolescence_date: $("#obsolescence_date").val(),
  //   useful_life: $("#usefullifeyr").val(),
  //   comments: $("#comments").val(),
  //   recommendations: $("#recommendations").val(),
  //   reviewed_by: $("#ereviewedby").val(),
  //   reviewed_date: $("#erevieweddate").val(),
  //   close_record: $("input[name=closerecord]:checked").val(),
  // };

  var getType = $("#EquipmentdetailmodalType").val();
  if (getType == "Add") {
    $.ajax({
      url: apiUrl + "equipment-details/",
      method: "POST",
      data: obj,
      success: function (response) {
        toastr.success("Equipment details added successfully");
        $("#EquipmentdetailmodalType").val("Add");
        $("#EquipmentdetailmodalId").val(0);
        $("#Equipmentdetailmodal").modal("hide");
      },
      error: function (xhr, status, error) {
        if (xhr.status === 400) {
          toastr.error("Bad Request: " + xhr.responseJSON.message);
        } else if (xhr.status === 401) {
          toastr.error("Unauthorized: " + xhr.responseJSON.message);
        } else if (xhr.status === 404) {
          toastr.error("Not Found: " + xhr.responseJSON.message);
        } else {
          toastr.error("Error: " + error);
        }
      },
    });
  } else if (getType == "Update") {
    var editEquipmentId = $("#EquipmentdetailmodalId").val();
    $.ajax({
      url: apiUrl + "equipment-details/" + editEquipmentId + "/",
      method: "PUT",
      data: obj,
      success: function (response) {
        toastr.success("Equipment details updated successfully");
        $("#EquipmentdetailmodalType").val("Add");
        $("#EquipmentdetailmodalId").val(0);
        $("#Equipmentdetailmodal").modal("hide");
      },
      error: function (xhr, status, error) {
        if (xhr.status === 400) {
          toastr.error("Bad Request: " + xhr.responseJSON.message);
        } else if (xhr.status === 401) {
          toastr.error("Unauthorized: " + xhr.responseJSON.message);
        } else if (xhr.status === 404) {
          toastr.error("Not Found: " + xhr.responseJSON.message);
        } else {
          toastr.error("Error: " + error);
        }
      },
    });
  }
}

$("input[name=classificationmet]").on("change", function () {
  $("input[name=classificationmet]").not(this).prop("checked", false);
});

$("input[name=manufacturerquality]").on("change", function () {
  $("input[name=manufacturerquality]").not(this).prop("checked", false);
});

$("input[name=manufacturerrecommendations]").on("change", function () {
  $("input[name=manufacturerrecommendations]").not(this).prop("checked", false);
});

$("input[name=maintenanceplan]").on("change", function () {
  $("input[name=maintenanceplan]").not(this).prop("checked", false);
});
