package fr.formation.inti.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * A Cours.
 */
@Entity
@Table(name = "cours")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Cours implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titre")
    private String titre;

    @Column(name = "date_ajout")
    private LocalDate dateAjout;

    @OneToMany(mappedBy = "video")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Video> videos = new HashSet<>();

    /**
     * Another side of the same relationship
     */
    @ApiModelProperty(value = "Another side of the same relationship")
    @ManyToOne
    @JsonIgnoreProperties("cours")
    private Eleve eleve;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public Cours titre(String titre) {
        this.titre = titre;
        return this;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public LocalDate getDateAjout() {
        return dateAjout;
    }

    public Cours dateAjout(LocalDate dateAjout) {
        this.dateAjout = dateAjout;
        return this;
    }

    public void setDateAjout(LocalDate dateAjout) {
        this.dateAjout = dateAjout;
    }

    public Set<Video> getVideos() {
        return videos;
    }

    public Cours videos(Set<Video> videos) {
        this.videos = videos;
        return this;
    }

    public Cours addVideo(Video video) {
        this.videos.add(video);
        video.setVideo(this);
        return this;
    }

    public Cours removeVideo(Video video) {
        this.videos.remove(video);
        video.setVideo(null);
        return this;
    }

    public void setVideos(Set<Video> videos) {
        this.videos = videos;
    }

    public Eleve getEleve() {
        return eleve;
    }

    public Cours eleve(Eleve eleve) {
        this.eleve = eleve;
        return this;
    }

    public void setEleve(Eleve eleve) {
        this.eleve = eleve;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cours)) {
            return false;
        }
        return id != null && id.equals(((Cours) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Cours{" +
            "id=" + getId() +
            ", titre='" + getTitre() + "'" +
            ", dateAjout='" + getDateAjout() + "'" +
            "}";
    }
}
