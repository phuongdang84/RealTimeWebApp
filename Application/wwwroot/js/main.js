$(document).ready(function () {
    var myDB;
    $('#TableData').html('');
    // Wait for PhoneGap to load
    document.addEventListener("deviceready", onDeviceReady(), false);


    // PhoneGap is ready
    function onDeviceReady() {
        var firstrun = window.localStorage.getItem('FirstRun');
        //myDB = window.openDatabase('Student.db', '1.0', 'Student DB', 2000000);
        //myDB.transaction(populateDB, errorDB, queryDB);
        if (firstrun === null) {
            window.localStorage.setItem('FirstRun', '1');
            myDB = window.openDatabase('Student.db', '1.0', 'Student DB', 2000000);
            myDB.transaction(populateDB, errorDB, queryDB);
        } else {
            // Db Alredy Exists
            myDB = window.openDatabase('Student.db', '1.0', 'Student DB', 2000000);
            queryDB(null);
        }
    }

    // Populate the database
    function populateDB(tx) {

        tx.executeSql('DROP TABLE IF EXISTS STUDENT');
        tx.executeSql('CREATE TABLE IF NOT EXISTS STUDENT' +
            '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, fullname TEXT NOT NULL,' +
            'gender TEXT NOT NULL, student_id TEXT NOT NULL, day_of_birth TEXT NOT NULL, ' +
            'email TEXT NOT NULL, phoneNum TEXT NOT NULL)');

        // init value
        addItemDB("Dang Nhu Phuong", "Male", "GCT19001", "11/06/1984", "phuongdang@gmail.com", "0909035075");
        addItemDB("Nguyen Thuy Thuy Van", "Female", "GCT19002", "09/06/1983", "vannguyen@gmail.com", "0909123456");
        addItemDB("Dang Thanh Long", "Male", "GCT19003", "04/20/2017", "longdang@gmail.com", "0909124433");
        addItemDB("Dang Thanh Vuong", "Male", "GCT19004", "01/24/2020", "vuongdang@gmail.com", "0909453345");
    }

    // Add the item
    //
    function addItemDB(fullname, gender, student_id, day_of_birth, email, phoneNum) {

        myDB.transaction(function (tx) {
            var query = 'INSERT INTO STUDENT (fullname, gender, student_id, day_of_birth,' +
                ' email, phoneNum ) VALUES (?,?,?,?,?,?)';
            tx.executeSql(
                query, [fullname, gender, student_id, day_of_birth, email, phoneNum],
            );
        },
            queryDB,
            errorDB)
    }

    // Select the items
    //
    function queryDB(keyword) {
        myDB.transaction(function (tx) {
            var query = '';
            if (keyword == '' ||
                keyword == null) {
                query = 'SELECT * FROM STUDENT ORDER BY id DESC';
            } else {
                //alert("eeeeeeeee " + keyword);
                query = 'SELECT * FROM STUDENT WHERE fullname LIKE "%' + keyword +
                    '%" OR student_id LIKE "%' + keyword + '%"';
            }
            tx.executeSql(query, [], queryTableSuccess, errorDB);
        });
    }

    // Delete the item
    //
    function deleteDB(Id) {
        myDB.transaction(function (tx) {
            var query = 'DELETE FROM STUDENT WHERE id=?';
            tx.executeSql(query, [Id], successDB, errorDB)
        });
    }

    // Searching the item Submit
    //  
    $('#searchStudent').submit(function (event) {
        $('#TableData').html('');
        var keyword = $('#keyword').val().trim();
        queryDB(keyword);
        event.preventDefault();
    });

    // Creating new item Submit
    //
    $('#createStudent').submit(function (event) {
        event.preventDefault();

        var student_id = $('#student_id').val().trim();
        var fullname = $('#fullname').val().trim();
        var date = moment($('#date').val()).format('MM/DD/YYYY');
        var gender = $('#gender').val().trim();
        var email = $('#email').val().trim();
        var phone = $('#phone').val().trim();

        //alert(' ' + date);
        //validation
        if (student_id === '' || student_id === null) {
            $('#error_id').text("Student's ID is required");
        } else if (fullname === '' || fullname === null) {
            $('#error_fullname').text("Fullname is required");
        } else if (date === '' || date === null) {
            $('#error_date').text("Birthday is required");
        } else if (email === '' || email === null) {
            $('#error_email').text("Email is required");
        } else if (phone === '' || phone === null) {
            $('#error_phone').text("Phone number is required");
        } else {
            addItemDB(
                fullname,
                gender,
                student_id,
                date,
                email,
                phone
            );
            $('input').each(function () {
                $(this).val('');
            });
        }
        //  console.log(title +""+ desc);

    });

    /*
        $('input').each(function() {
            var value = $(this).val().trim();
            if (value !== '' || value !== null) {
                $(this).valueChange({

                });
            }
        });
    */
    // Delete item Submit
    //
    $(document.body).on('click', '#btn-recycle', function () {
        var decision = confirm("Are you sure you want to clear all histories?");
        if (decision === true) {
            deleteDB();
        }
    });

    $(document.body).on('click', '#btn-logout', function () {
        var decision = confirm("Are you sure you want to change account?");
        if (decision === true) {
            window.location = 'index.html';
        }
    });

    // Query the success callback
    //
    function queryTableSuccess(tx, results) {
        var length = results.rows.length,
            i;
        for (i = 0; i < length; i++) {
            $('#dataTable').append(
                '<div class="table-row">' +
                '<div class="td col-1">' +
                '<div class="row-title">' +
                '<span class="title">' + results.rows.item(i).fullname + '</span>' +
                '<span class="gender">' + results.rows.item(i).gender + '</span>' +
                '</div>' +
                '<div class="row-info">' +
                '<span>ID: ' + results.rows.item(i).student_id + '</span>' +
                '<span>' + results.rows.item(i).day_of_birth + '</span>' +
                '</div>' +
                '<div class="row-info-1">' +
                '<span>' + results.rows.item(i).email + '</span>' +
                '<span>' + results.rows.item(i).phoneNum + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="td col-2">' +
                '<button class="btn-delete" id="' + results.rows.item(i).id +
                '"type="button">Delete</button>' +
                '</div>' +
                '</div>'
            );
        }
    }

    // Transaction error callback
    //
    function successDB() {
        alert('Delete successfully');
        window.location = 'index.html';
    }

    // Transaction error callback
    //
    function errorDB(tx, err) {
        alert("Error processing SQL: " + err);
    }

});