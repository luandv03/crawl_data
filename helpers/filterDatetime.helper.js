const filterDatetime = (string) => {
    const regex = /(\d{4})\/(\d{2})\/(\d{2})/; // Biểu thức chính quy để tìm kiếm ngày tháng năm

    const matches = string.match(regex); // Lọc ra các kết quả phù hợp với biểu thức chính quy

    if (matches && matches.length >= 4) {
        const year = matches[1];
        const month = matches[2];
        const day = matches[3];

        return `${day}/${month}/${year}`;
    } else {
        return null;
    }
};

module.exports = filterDatetime;
