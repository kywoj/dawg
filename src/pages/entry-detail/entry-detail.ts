import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Pet } from '../../models/entry';
import { EntryDataServiceProvider } from '../../providers/entry-data-service/entry-data-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HomePage } from '../home/home'



const PLACEHOLDER_IMAGE: string = "/assets/imgs/placeholder.png";
const SPINNER_IMAGE: string = "/assets/imgs/spinner.gif";

@IonicPage()
@Component({
  selector: 'page-entry-detail',
  templateUrl: 'entry-detail.html',
})
export class EntryDetailPage {

  private entry: Pet;
  private createDate: Date;
  private image = PLACEHOLDER_IMAGE;


  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public entryDataService: EntryDataServiceProvider, 
    private camera: Camera,
    private alertCtrl: AlertController) {

    let entryID = this.navParams.get("entryID");
    let entry = this.entryDataService.getEntryByID(entryID);

  if (entryID === undefined) {
    this.entry = new Pet();
    this.entry.title = "";
    this.entry.text = "";
    this.entry.id = -1; // placeholder for 'temporary' entry
    this.entry.image = PLACEHOLDER_IMAGE;

  } else {
  this.entry = this.entryDataService.getEntryByID(entryID);
  if (typeof this.entry.timestamp === 'string') {
    this.createDate = new Date(this.entry.timestamp);
  } else { this.createDate = this.entry.timestamp }
  
}
    console.log("retrieved entry:", entry);

  }

private saveEntry() {
  if (this.entry.image === PLACEHOLDER_IMAGE) {
    let rand = Math.floor(Math.random()*3)+1;
    this.entry.image = "/assets/imgs/dog" + rand + '.jpg'
  }
  if (this.entry.id === -1) { 
    this.entryDataService.addEntry(this.entry);
  } else {
    this.entryDataService.updateEntry(this.entry.id, this.entry);
  }
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop()
    }
    else{
      this.navCtrl.setRoot(HomePage);
    }
    

}

public cancelEntry() {
  this.navCtrl.pop()
}


private deleteEntry(petID: number) {
  this.entryDataService.removeEntry(petID)
  if (this.navCtrl.canGoBack()) {
    this.navCtrl.pop()
  }
  else{
    this.navCtrl.setRoot(HomePage);
  }
  
}




public ConfirmDelete(id): any {
  let alert = this.alertCtrl.create({
    title: 'Confirm Pet Deletion',
    message: 'Do you want to delete this pet?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('I said no')
          
        }
      },
      {
        text: 'Delete',
        handler: () => {
          console.log("I said yes")
          this.deleteEntry(id)
        }
      }
    ]
  });
  alert.present();
}








  ionViewDidLoad() {
    console.log('ionViewDidLoad EntryDetailPage');
  }

  private takePic() {
    let img = this.entry.image;
    const options: CameraOptions = {
      quality: 10,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      if (imageData) {
        this.entry.image = 'data:image/jpeg;base64,' + imageData;        
      } else {
        this.entry.image = img;
      }
     }, (err) => {
        this.entry.image = img;
     });
    this.entry.image = SPINNER_IMAGE;
  }







  public hidden(id): string {
    if (id === -1)
    return "hidden"
  }


}
