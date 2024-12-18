export const timeDistanceHelper = (data) => {



    let time = data.duration;
  if (time >= 3600) {
    time = `${Math.round(time / 3600)} hours away`;
  } else {
    time = `${Math.round(time / 60)} mins away`;
  }


  let distance = data.distance;
  if (distance >= 1000) {
    distance = `${(distance / 1000).toFixed(1)} Km`;
  } else {
    distance = `${distance.toFixed(1)} m`;
  }


  return {time,distance};
};
