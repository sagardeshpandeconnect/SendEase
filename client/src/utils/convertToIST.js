export function convertToIST(utcTimestamp) {
    const utcDate = new Date(utcTimestamp);
    const utcTime = utcDate.getTime();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(utcTime + istOffset);
    const day = String(istTime.getDate()).padStart(2, "0");
    const month = String(istTime.getMonth() + 1).padStart(2, "0");
    const year = istTime.getFullYear();
    let hours = istTime.getHours();
    const minutes = String(istTime.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? " p.m." : " a.m.";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const istTimeString = `${day}-${month}-${year}, ${hours}.${minutes}${ampm}`;
    return istTimeString;
  }
  