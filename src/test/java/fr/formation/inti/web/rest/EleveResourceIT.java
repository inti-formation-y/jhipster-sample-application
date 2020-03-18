package fr.formation.inti.web.rest;

import fr.formation.inti.JhEmployeeApp;
import fr.formation.inti.domain.Eleve;
import fr.formation.inti.repository.EleveRepository;
import fr.formation.inti.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static fr.formation.inti.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.formation.inti.domain.enumeration.Classe;
/**
 * Integration tests for the {@Link EleveResource} REST controller.
 */
@SpringBootTest(classes = JhEmployeeApp.class)
public class EleveResourceIT {

    private static final byte[] DEFAULT_PHOTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PHOTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PHOTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PHOTO_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_MOBILE = "AAAAAAAAAA";
    private static final String UPDATED_MOBILE = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_NAISSANCE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_NAISSANCE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Classe DEFAULT_CLASSE = Classe.CP;
    private static final Classe UPDATED_CLASSE = Classe.CE1;

    @Autowired
    private EleveRepository eleveRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restEleveMockMvc;

    private Eleve eleve;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EleveResource eleveResource = new EleveResource(eleveRepository);
        this.restEleveMockMvc = MockMvcBuilders.standaloneSetup(eleveResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Eleve createEntity(EntityManager em) {
        Eleve eleve = new Eleve()
            .photo(DEFAULT_PHOTO)
            .photoContentType(DEFAULT_PHOTO_CONTENT_TYPE)
            .nom(DEFAULT_NOM)
            .prenom(DEFAULT_PRENOM)
            .adresse(DEFAULT_ADRESSE)
            .email(DEFAULT_EMAIL)
            .mobile(DEFAULT_MOBILE)
            .dateNaissance(DEFAULT_DATE_NAISSANCE)
            .classe(DEFAULT_CLASSE);
        return eleve;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Eleve createUpdatedEntity(EntityManager em) {
        Eleve eleve = new Eleve()
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE)
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .adresse(UPDATED_ADRESSE)
            .email(UPDATED_EMAIL)
            .mobile(UPDATED_MOBILE)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .classe(UPDATED_CLASSE);
        return eleve;
    }

    @BeforeEach
    public void initTest() {
        eleve = createEntity(em);
    }

    @Test
    @Transactional
    public void createEleve() throws Exception {
        int databaseSizeBeforeCreate = eleveRepository.findAll().size();

        // Create the Eleve
        restEleveMockMvc.perform(post("/api/eleves")
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .content(TestUtil.convertObjectToJsonBytes(eleve)))
            .andExpect(status().isCreated());

        // Validate the Eleve in the database
        List<Eleve> eleveList = eleveRepository.findAll();
        assertThat(eleveList).hasSize(databaseSizeBeforeCreate + 1);
        Eleve testEleve = eleveList.get(eleveList.size() - 1);
        assertThat(testEleve.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testEleve.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
        assertThat(testEleve.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testEleve.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testEleve.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testEleve.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testEleve.getMobile()).isEqualTo(DEFAULT_MOBILE);
        assertThat(testEleve.getDateNaissance()).isEqualTo(DEFAULT_DATE_NAISSANCE);
        assertThat(testEleve.getClasse()).isEqualTo(DEFAULT_CLASSE);
    }

    @Test
    @Transactional
    public void createEleveWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = eleveRepository.findAll().size();

        // Create the Eleve with an existing ID
        eleve.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEleveMockMvc.perform(post("/api/eleves")
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .content(TestUtil.convertObjectToJsonBytes(eleve)))
            .andExpect(status().isBadRequest());

        // Validate the Eleve in the database
        List<Eleve> eleveList = eleveRepository.findAll();
        assertThat(eleveList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllEleves() throws Exception {
        // Initialize the database
        eleveRepository.saveAndFlush(eleve);

        // Get all the eleveList
        restEleveMockMvc.perform(get("/api/eleves?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eleve.getId().intValue())))
            .andExpect(jsonPath("$.[*].photoContentType").value(hasItem(DEFAULT_PHOTO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].photo").value(hasItem(Base64Utils.encodeToString(DEFAULT_PHOTO))))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM.toString())))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM.toString())))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())))
            .andExpect(jsonPath("$.[*].mobile").value(hasItem(DEFAULT_MOBILE.toString())))
            .andExpect(jsonPath("$.[*].dateNaissance").value(hasItem(DEFAULT_DATE_NAISSANCE.toString())))
            .andExpect(jsonPath("$.[*].classe").value(hasItem(DEFAULT_CLASSE.toString())));
    }
    
    @Test
    @Transactional
    public void getEleve() throws Exception {
        // Initialize the database
        eleveRepository.saveAndFlush(eleve);

        // Get the eleve
        restEleveMockMvc.perform(get("/api/eleves/{id}", eleve.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(eleve.getId().intValue()))
            .andExpect(jsonPath("$.photoContentType").value(DEFAULT_PHOTO_CONTENT_TYPE))
            .andExpect(jsonPath("$.photo").value(Base64Utils.encodeToString(DEFAULT_PHOTO)))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM.toString()))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM.toString()))
            .andExpect(jsonPath("$.adresse").value(DEFAULT_ADRESSE.toString()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL.toString()))
            .andExpect(jsonPath("$.mobile").value(DEFAULT_MOBILE.toString()))
            .andExpect(jsonPath("$.dateNaissance").value(DEFAULT_DATE_NAISSANCE.toString()))
            .andExpect(jsonPath("$.classe").value(DEFAULT_CLASSE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingEleve() throws Exception {
        // Get the eleve
        restEleveMockMvc.perform(get("/api/eleves/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEleve() throws Exception {
        // Initialize the database
        eleveRepository.saveAndFlush(eleve);

        int databaseSizeBeforeUpdate = eleveRepository.findAll().size();

        // Update the eleve
        Eleve updatedEleve = eleveRepository.findById(eleve.getId()).get();
        // Disconnect from session so that the updates on updatedEleve are not directly saved in db
        em.detach(updatedEleve);
        updatedEleve
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE)
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .adresse(UPDATED_ADRESSE)
            .email(UPDATED_EMAIL)
            .mobile(UPDATED_MOBILE)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .classe(UPDATED_CLASSE);

        restEleveMockMvc.perform(put("/api/eleves")
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .content(TestUtil.convertObjectToJsonBytes(updatedEleve)))
            .andExpect(status().isOk());

        // Validate the Eleve in the database
        List<Eleve> eleveList = eleveRepository.findAll();
        assertThat(eleveList).hasSize(databaseSizeBeforeUpdate);
        Eleve testEleve = eleveList.get(eleveList.size() - 1);
        assertThat(testEleve.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testEleve.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
        assertThat(testEleve.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testEleve.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testEleve.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testEleve.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testEleve.getMobile()).isEqualTo(UPDATED_MOBILE);
        assertThat(testEleve.getDateNaissance()).isEqualTo(UPDATED_DATE_NAISSANCE);
        assertThat(testEleve.getClasse()).isEqualTo(UPDATED_CLASSE);
    }

    @Test
    @Transactional
    public void updateNonExistingEleve() throws Exception {
        int databaseSizeBeforeUpdate = eleveRepository.findAll().size();

        // Create the Eleve

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEleveMockMvc.perform(put("/api/eleves")
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .content(TestUtil.convertObjectToJsonBytes(eleve)))
            .andExpect(status().isBadRequest());

        // Validate the Eleve in the database
        List<Eleve> eleveList = eleveRepository.findAll();
        assertThat(eleveList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteEleve() throws Exception {
        // Initialize the database
        eleveRepository.saveAndFlush(eleve);

        int databaseSizeBeforeDelete = eleveRepository.findAll().size();

        // Delete the eleve
        restEleveMockMvc.perform(delete("/api/eleves/{id}", eleve.getId())
            .accept(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Eleve> eleveList = eleveRepository.findAll();
        assertThat(eleveList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Eleve.class);
        Eleve eleve1 = new Eleve();
        eleve1.setId(1L);
        Eleve eleve2 = new Eleve();
        eleve2.setId(eleve1.getId());
        assertThat(eleve1).isEqualTo(eleve2);
        eleve2.setId(2L);
        assertThat(eleve1).isNotEqualTo(eleve2);
        eleve1.setId(null);
        assertThat(eleve1).isNotEqualTo(eleve2);
    }
}
